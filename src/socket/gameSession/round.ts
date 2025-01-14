import { BattleData, roomData, SOCKET_EVENTS, SocResponse } from "../interface/interface";
import Echo from "../helper/@echo";
import RoundCalc from "./roundCalc";
import AgentBattleData from "./agentBattleData";

export default class Round {
    isRoundActive: boolean;
    roomData: roomData;
    totalRounds: number;
    currentRound: number;
    timeout: number; // how long each round will last
    timeReset!: NodeJS.Timeout | undefined;
    playerOneBD!: BattleData;
    playerTwoBD!: BattleData;

    playerOneHealth: number;
    playerTwoHealth: number;

    isOneBDSet: boolean;
    isTwoBDSet: boolean;

    isRobot: boolean;
    agentBattleData!: AgentBattleData

    constructor(roomData: roomData) {
        this.currentRound = 0;
        this.totalRounds = 3;
        this.timeout = 35;
        this.roomData = roomData;
        this.isRobot = roomData.isRobot != undefined;
        this.agentBattleData = new AgentBattleData();
        this.isRoundActive = roomData.isActive;
        this.playerOneHealth = this.playerTwoHealth = 50;
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
            PlayerHealth: 20,
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
        }

        this.playerOneBD = { ...battleData, PlayerHealth: this.playerOneHealth };
        this.playerTwoBD = { ...battleData, PlayerHealth: this.playerTwoHealth };
    }

    startRound() {
        this.generateRound();

        if (!this.isRobot && this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            Echo.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], this.compileRoundData(SOCKET_EVENTS.formationStart));

        if (this.isRobot && this.roomData.playerOneSoc)
            Echo.client(this.roomData.playerOneSoc, this.compileRoundData(SOCKET_EVENTS.formationStart));

        this.timeReset = setTimeout(() => {
            this.endRound()
        }, (this.timeout * 1000));
    }

    endRound() {
        if (!this.isRobot && this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            Echo.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], { action: SOCKET_EVENTS.formationEnd });

        if (this.isRobot && this.roomData.playerOneSoc)
            Echo.client(this.roomData.playerOneSoc, this.compileRoundData(SOCKET_EVENTS.formationEnd));

        this.updateRound();
    }

    updateRound() {
        clearTimeout(this.timeReset);
        this.timeReset = undefined;
        this.currentRound++;

        // console.log("current round is " + this.currentRound);
    }

    setPlayerData(playerID: any) {
        // console.log(playerID);

        const dataSender = playerID.playerID;

        this.manageGameDataWithPlayer(dataSender, playerID);

        this.manageGameDataWithRobot(dataSender, playerID);

        if (this.isOneBDSet && this.isTwoBDSet) {

            if (this.timeReset) this.updateRound();

            this.calculateRoundData();
        }
    }

    manageGameDataWithPlayer(dataSender: any, playerID: any) {
        if (this.isRobot) return;
        if (dataSender === this.roomData.playerOne && !this.isOneBDSet) {
            this.playerOneBD = playerID.playerOneBD;
            this.playerOneBD.PlayerHealth = this.playerOneHealth;
            this.isOneBDSet = true;
        } else if (dataSender === this.roomData.playerTwo && !this.isTwoBDSet) {
            this.playerTwoBD = playerID.playerOneBD;
            this.playerTwoBD.PlayerHealth = this.playerTwoHealth;
            this.isTwoBDSet = true;
        }
    }

    manageGameDataWithRobot(dataSender: any, playerID: any) {
        if (!this.isRobot) return;

        if (dataSender === this.roomData.playerOne && !this.isOneBDSet) {
            this.playerOneBD = playerID.playerOneBD;
            this.playerOneBD.PlayerHealth = this.playerOneHealth;
            this.isOneBDSet = true;

            // set robot date
            this.playerTwoBD = this.agentBattleData.get();
            this.playerTwoBD.PlayerHealth = this.playerTwoHealth;
            this.isTwoBDSet = true;
        }


    }

    calculateRoundData() {
        // console.log(this.playerOneBD, this.playerTwoBD);
        const calc = new RoundCalc(this.playerOneBD, this.playerTwoBD);
        calc.calc();

        this.playerOneHealth = calc.plOneResult.PlayerHealth;
        this.playerTwoHealth = calc.plTwoResult.PlayerHealth;

        this.playerOneBD = calc.plOneResult;
        this.playerTwoBD = calc.plTwoResult;

        this.sendRoundData();
    }

    sendRoundData() {
        if (!this.isRobot && this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            Echo.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], this.compileRoundData(SOCKET_EVENTS.battleData));

        if (this.isRobot && this.roomData.playerOneSoc)
            Echo.client(this.roomData.playerOneSoc, this.compileRoundData(SOCKET_EVENTS.battleData));

        this.findRoundWinner();
    }

    findRoundWinner() {

        this.restartRound();
    }

    restartRound() {
        if (this.currentRound < this.totalRounds)
            setTimeout(() => {
                this.startRound()
            }, this.timeout * 1000);
        else
            this.endMatch();
    }

    endMatch() {
        if (!this.isRobot && this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            Echo.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], this.compileRoundData(SOCKET_EVENTS.sessionEnd));

        if (this.isRobot && this.roomData.playerOneSoc)
            Echo.client(this.roomData.playerOneSoc, this.compileRoundData(SOCKET_EVENTS.sessionEnd));
    }

    compileRoundData(action: SOCKET_EVENTS): SocResponse {
        this.isOneBDSet = this.isTwoBDSet = false;
        return {
            action: action,
            roomID: this.roomData.roomID,
            playerOne: this.roomData.playerOne,
            playerOneBD: this.playerOneBD,
            playerTwo: this.roomData.playerTwo,
            playerTwoBD: this.playerTwoBD,
            roundTimeout: this.timeout,
            currentRound: this.currentRound + 1,
            totalRounds: this.totalRounds,
        }
    }


}

// const demoRound = new Round({roomID: "rt235", isActive: true});
// demoRound.playerOneBD = JSON.parse("{\"AttackCard\":\"sango\",\"DefenseCard\":\"osun\",\"AttackSpell\":\"doubleByTwo\",\"DefenseSpell\":\"divideByTwo\",\"AttackPoint\":10,\"DefensePoint\":8,\"PlayerHealth\":20}");
// demoRound.playerTwoBD = JSON.parse("{\"AttackCard\":\"osun\",\"DefenseCard\":\"sango\",\"AttackSpell\":\"divideByTwo\",\"DefenseSpell\":\"doubleByTwo\",\"AttackPoint\":4,\"DefensePoint\":4,\"PlayerHealth\":20}");
//
// demoRound.calculateRoundData();