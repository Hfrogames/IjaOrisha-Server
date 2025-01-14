"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interface_1 = require("../interface/interface");
class RoundCalc {
    plOne;
    plTwo;
    plOneResult;
    plTwoResult;
    constructor(playerOne, playerTwo) {
        this.plOne = playerOne;
        this.plTwo = playerTwo;
        this.plOneResult = this.plOne;
        this.plTwoResult = this.plTwo;
    }
    prePointSpell = {
        [interface_1.Spells.doubleByTwo]: (value) => value * 2,
    };
    postPointSpell = {
        [interface_1.Spells.divideByTwo]: (value) => value / 2,
    };
    getAttackPoint(battleData) {
        let attackValue = battleData.AttackPoint;
        const attackSpell = this.prePointSpell[battleData.AttackSpell];
        if (attackSpell)
            attackValue = attackSpell(attackValue);
        return attackValue;
    }
    getDefensePoint(battleData) {
        let defenseValue = battleData.DefensePoint;
        const defenseSpell = this.prePointSpell[battleData.DefenseSpell];
        if (defenseSpell)
            defenseValue = defenseSpell(defenseValue);
        return defenseValue;
    }
    getPostSpellPoint(spell, value) {
        const postPointSpell = this.postPointSpell[spell];
        if (postPointSpell)
            return postPointSpell(value);
        else
            return value;
    }
    findWinner(valueOne, valueTwo) {
        const res = valueOne - valueTwo;
        return res > 0 ? res : 0;
    }
    calc() {
        let playerOneAttack = this.getAttackPoint(this.plOne);
        let playerOneDefence = this.getDefensePoint(this.plOne);
        let playerTwoAttack = this.getAttackPoint(this.plTwo);
        let playerTwoDefence = this.getDefensePoint(this.plTwo);
        // console.log({playerOneAttack, playerOneDefence, playerTwoAttack, playerTwoDefence});
        // apply post point spell
        playerOneAttack = this.getPostSpellPoint(this.plTwo.DefenseSpell, playerOneAttack);
        playerOneDefence = this.getPostSpellPoint(this.plTwo.AttackSpell, playerOneDefence);
        playerTwoAttack = this.getPostSpellPoint(this.plOne.DefenseSpell, playerTwoAttack);
        playerTwoDefence = this.getPostSpellPoint(this.plOne.AttackSpell, playerTwoDefence);
        // console.log({playerOneAttack, playerOneDefence, playerTwoAttack, playerTwoDefence});
        this.plOneResult.AttackPointSpelled = playerOneAttack;
        this.plOneResult.DefencePointSpelled = playerOneDefence;
        this.plTwoResult.AttackPointSpelled = playerTwoAttack;
        this.plTwoResult.DefencePointSpelled = playerTwoDefence;
        // console.log({playerOneAttack, playerOneDefence, playerTwoAttack, playerTwoDefence});
        // calculation point attack
        const playerOneAttackScore = this.findWinner(playerOneAttack, playerTwoDefence);
        const playerOneDefenceScore = this.findWinner(playerOneDefence, playerTwoAttack);
        const playerTwoAttackScore = this.findWinner(playerTwoAttack, playerOneDefence);
        const playerTwoDefenceScore = this.findWinner(playerTwoDefence, playerOneAttack);
        // console.log({playerOneAttack, playerOneDefence, playerTwoAttack, playerTwoDefence});
        // console.log({playerOneAttackScore, playerOneDefenceScore, playerTwoAttackScore, playerTwoDefenceScore});
        // attack health
        const playerOneHealth = this.roundUpToZero(this.plOne.PlayerHealth - playerTwoAttackScore);
        const playerTwoHealth = this.roundUpToZero(this.plTwo.PlayerHealth - playerOneAttackScore);
        this.plOneResult.AttackPoint = playerOneAttack;
        this.plOneResult.DefensePoint = playerOneDefence;
        this.plOneResult.PlayerHealth = playerOneHealth;
        this.plTwoResult.AttackPoint = playerTwoAttack;
        this.plTwoResult.DefensePoint = playerTwoDefence;
        this.plTwoResult.PlayerHealth = playerTwoHealth;
        // console.log(this.plOneResult);
        // console.log(this.plTwoResult);
    }
    roundUpToZero(num) {
        return num < 0 ? 0 : Math.ceil(num);
    }
}
exports.default = RoundCalc;
