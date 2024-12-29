import {BattleData, roomData, SOCKET_EVENTS, SocResponse} from "../interface/interface";
import Echo from "../helper/@echo";
import RoundCalc from "./roundCalc";

export default class Round {
    isRoundActive: boolean;
    roomData: roomData;
    totalRounds: number;
    currentRound: number;
    timeout: number; // how long each round will last
    timeReset!: NodeJS.Timeout;
    playerOneBD!: BattleData;
    playerTwoBD!: BattleData;

    isOneBDSet: boolean;
    isTwoBDSet: boolean;

    constructor(roomData: roomData) {
        this.currentRound = 1;
        this.totalRounds = 3;
        this.timeout = 20;
        this.roomData = roomData;
        this.isRoundActive = roomData.isActive;
        this.isOneBDSet = this.isTwoBDSet = false;
        this.startRound();
    }

    generateRound() {
        if (this.currentRound == 1) return this.resetRound();
        else return this.roundData();
    }

    resetRound() {
        const battleData = {
            AttackCard: "",
            DefenseCard: "",
            AttackSpell: "",
            DefenseSpell: "",
            AttackPoint: 0,
            DefensePoint: 0,
            PlayerHealth: 100,
        }
        this.playerOneBD = this.playerTwoBD = battleData;
    }

    roundData() {
        const battleData = {
            AttackCard: "",
            DefenseCard: "",
            AttackSpell: "",
            DefenseSpell: "",
            AttackPoint: 0,
            DefensePoint: 0,
            PlayerHealth: 50,
        }
        this.playerOneBD = this.playerTwoBD = battleData;
    }

    startRound() {
        this.generateRound();

        if (this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            Echo.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], this.compileRoundData(SOCKET_EVENTS.formationStart));

        this.timeReset = setTimeout(() => this.endRound(), (this.timeout * 1000));
    }

    endRound() {
        if (this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            Echo.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], {action: SOCKET_EVENTS.formationEnd});
        this.currentRound++;
    }

    setPlayerData(playerID: any) {
        const dataSender = playerID.playerID;

        if (dataSender === this.roomData.playerOne) {
            this.playerOneBD = playerID.playerOneBD;
            this.isOneBDSet = true;
        } else if (dataSender === this.roomData.playerTwo) {
            this.playerTwoBD = playerID.playerOneBD;
            this.isTwoBDSet = true;
        }

        if (this.isOneBDSet && this.isTwoBDSet) {
            this.calculateRoundData();
        }
    }

    calculateRoundData() {
        const calc = new RoundCalc(this.playerOneBD, this.playerTwoBD);
        calc.calc();

        this.playerOneBD = calc.plOneResult;
        this.playerTwoBD = calc.plTwoResult;

        this.sendRoundData();
    }

    sendRoundData() {
        if (this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            Echo.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], this.compileRoundData(SOCKET_EVENTS.battleData));

        this.findRoundWinner();
    }

    findRoundWinner() {

        this.restartRound();
    }

    restartRound() {
        if (this.currentRound < this.totalRounds)
            setTimeout(() => this.startRound(), 30 * 1000);
        else
            this.endMatch();
    }

    endMatch() {
        if (this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            Echo.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], this.compileRoundData(SOCKET_EVENTS.sessionEnd));
    }

    compileRoundData(action: SOCKET_EVENTS): SocResponse {
        return {
            action: action,
            roomID: this.roomData.roomID,
            playerOne: this.roomData.playerOne,
            playerOneBD: this.playerOneBD,
            playerTwo: this.roomData.playerTwo,
            playerTwoBD: this.playerTwoBD,
            roundTimeout: this.timeout,
            currentRound: this.currentRound,
            totalRounds: this.totalRounds,
        }
    }


}

// const demoRound = new Round({roomID: "rt235", isActive: true});
// demoRound.playerOneBD = JSON.parse("{\"AttackCard\":\"sango\",\"DefenseCard\":\"osun\",\"AttackSpell\":\"doubleByTwo\",\"DefenseSpell\":\"divideByTwo\",\"AttackPoint\":10,\"DefensePoint\":8,\"PlayerHealth\":100}");
// demoRound.playerTwoBD = JSON.parse("{\"AttackCard\":\"sango\",\"DefenseCard\":\"ogun\",\"AttackSpell\":\"None\",\"DefenseSpell\":\"None\",\"AttackPoint\":10,\"DefensePoint\":6,\"PlayerHealth\":100}");
//
// demoRound.calculateRoundData();