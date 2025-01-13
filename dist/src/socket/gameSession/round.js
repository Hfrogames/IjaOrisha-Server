"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../interface/interface");
const _echo_1 = __importDefault(require("../helper/@echo"));
const roundCalc_1 = __importDefault(require("./roundCalc"));
const agentBattleData_1 = __importDefault(require("./agentBattleData"));
class Round {
    isRoundActive;
    roomData;
    totalRounds;
    currentRound;
    timeout; // how long each round will last
    timeReset;
    playerOneBD;
    playerTwoBD;
    playerOneHealth;
    playerTwoHealth;
    isOneBDSet;
    isTwoBDSet;
    isRobot;
    agentBattleData;
    constructor(roomData) {
        this.currentRound = 1;
        this.totalRounds = 3;
        this.timeout = 35;
        this.roomData = roomData;
        this.isRobot = roomData.isRobot != undefined;
        this.agentBattleData = new agentBattleData_1.default();
        this.isRoundActive = roomData.isActive;
        this.playerOneHealth = this.playerTwoHealth = 50;
        this.isOneBDSet = this.isTwoBDSet = false;
        this.startRound();
    }
    generateRound() {
        if (this.currentRound == 1)
            return this.resetRound();
        else
            return this.roundData();
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
        };
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
        };
        this.playerOneBD = { ...battleData, PlayerHealth: this.playerOneHealth };
        this.playerTwoBD = { ...battleData, PlayerHealth: this.playerTwoHealth };
    }
    startRound() {
        this.generateRound();
        if (!this.isRobot && this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            _echo_1.default.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], this.compileRoundData(interface_1.SOCKET_EVENTS.formationStart));
        if (this.isRobot && this.roomData.playerOneSoc)
            _echo_1.default.client(this.roomData.playerOneSoc, this.compileRoundData(interface_1.SOCKET_EVENTS.formationStart));
        this.timeReset = setTimeout(() => {
            this.endRound();
        }, (this.timeout * 1000));
    }
    endRound() {
        if (!this.isRobot && this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            _echo_1.default.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], { action: interface_1.SOCKET_EVENTS.formationEnd });
        if (this.isRobot && this.roomData.playerOneSoc)
            _echo_1.default.client(this.roomData.playerOneSoc, this.compileRoundData(interface_1.SOCKET_EVENTS.formationEnd));
        this.currentRound++;
    }
    setPlayerData(playerID) {
        const dataSender = playerID.playerID;
        this.manageGameDataWithPlayer(dataSender, playerID);
        this.manageGameDataWithRobot(dataSender, playerID);
        if (this.isOneBDSet && this.isTwoBDSet) {
            this.calculateRoundData();
        }
    }
    manageGameDataWithPlayer(dataSender, playerID) {
        if (this.isRobot)
            return;
        if (dataSender === this.roomData.playerOne && !this.isOneBDSet) {
            this.playerOneBD = playerID.playerOneBD;
            this.playerOneBD.PlayerHealth = this.playerOneHealth;
            this.isOneBDSet = true;
        }
        else if (dataSender === this.roomData.playerTwo && !this.isTwoBDSet) {
            this.playerTwoBD = playerID.playerOneBD;
            this.playerTwoBD.PlayerHealth = this.playerTwoHealth;
            this.isTwoBDSet = true;
        }
    }
    manageGameDataWithRobot(dataSender, playerID) {
        if (!this.isRobot)
            return;
        console.log(playerID);
        if (dataSender === this.roomData.playerOne && !this.isOneBDSet) {
            this.playerOneBD = playerID.playerOneBD;
            this.playerOneBD.PlayerHealth = this.playerOneHealth;
            this.isOneBDSet = true;
            // set robot date
            this.playerTwoBD = this.agentBattleData.get();
            console.log("robot data", this.playerTwoBD);
            this.playerTwoBD.PlayerHealth = this.playerTwoHealth;
            this.isTwoBDSet = true;
        }
    }
    calculateRoundData() {
        // console.log(this.playerOneBD, this.playerTwoBD);
        const calc = new roundCalc_1.default(this.playerOneBD, this.playerTwoBD);
        calc.calc();
        this.playerOneHealth = calc.plOneResult.PlayerHealth;
        this.playerTwoHealth = calc.plTwoResult.PlayerHealth;
        this.playerOneBD = calc.plOneResult;
        this.playerTwoBD = calc.plTwoResult;
        this.sendRoundData();
    }
    sendRoundData() {
        if (!this.isRobot && this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            _echo_1.default.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], this.compileRoundData(interface_1.SOCKET_EVENTS.battleData));
        if (this.isRobot && this.roomData.playerOneSoc)
            _echo_1.default.client(this.roomData.playerOneSoc, this.compileRoundData(interface_1.SOCKET_EVENTS.battleData));
        this.findRoundWinner();
    }
    findRoundWinner() {
        this.restartRound();
    }
    restartRound() {
        if (this.currentRound < this.totalRounds)
            setTimeout(() => {
                this.startRound();
            }, this.timeout * 1000);
        else
            this.endMatch();
    }
    endMatch() {
        if (!this.isRobot && this.roomData.playerOneSoc && this.roomData.playerTwoSoc)
            _echo_1.default.roomClient([this.roomData.playerOneSoc, this.roomData.playerTwoSoc], this.compileRoundData(interface_1.SOCKET_EVENTS.sessionEnd));
        if (this.isRobot && this.roomData.playerOneSoc)
            _echo_1.default.client(this.roomData.playerOneSoc, this.compileRoundData(interface_1.SOCKET_EVENTS.sessionEnd));
    }
    compileRoundData(action) {
        this.isOneBDSet = this.isTwoBDSet = false;
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
        };
    }
}
exports.default = Round;
// const demoRound = new Round({roomID: "rt235", isActive: true});
// demoRound.playerOneBD = JSON.parse("{\"AttackCard\":\"sango\",\"DefenseCard\":\"osun\",\"AttackSpell\":\"doubleByTwo\",\"DefenseSpell\":\"divideByTwo\",\"AttackPoint\":10,\"DefensePoint\":8,\"PlayerHealth\":20}");
// demoRound.playerTwoBD = JSON.parse("{\"AttackCard\":\"osun\",\"DefenseCard\":\"sango\",\"AttackSpell\":\"divideByTwo\",\"DefenseSpell\":\"doubleByTwo\",\"AttackPoint\":4,\"DefensePoint\":4,\"PlayerHealth\":20}");
//
// demoRound.calculateRoundData();
