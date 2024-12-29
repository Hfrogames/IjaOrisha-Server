import {BattleData, Spells} from "../interface/interface";

export default class RoundCalc {
    plOne: BattleData;
    plTwo: BattleData;
    plOneResult: BattleData;
    plTwoResult: BattleData;

    constructor(playerOne: BattleData, playerTwo: BattleData) {
        this.plOne = playerOne;
        this.plTwo = playerTwo;

        this.plOneResult = this.plOne;
        this.plTwoResult = this.plTwo;
    }

    prePointSpell = {
        [Spells.doubleByTwo]: (value) => value * 2,
    }

    postPointSpell = {
        [Spells.divideByTwo]: (value) => value / 2,
    }

    getAttackPoint(battleData: BattleData) {
        let attackValue = battleData.AttackPoint;
        const attackSpell = this.prePointSpell[battleData.AttackSpell];

        if (attackSpell)
            attackValue = attackSpell(attackValue);

        return attackValue;
    }

    getDefensePoint(battleData: BattleData) {
        let defenseValue = battleData.DefensePoint;
        const defenseSpell = this.prePointSpell[battleData.DefensePoint]

        if (defenseSpell)
            defenseValue = defenseSpell(defenseValue);

        return defenseValue;
    }

    getPostSpellPoint(spell: Spells, value: number) {
        const postPointSpell = this.postPointSpell[spell];

        if (postPointSpell)
            return postPointSpell(value);
        else return value;
    }

    findWinner(valueOne, valueTwo) {
        const res = valueOne - valueTwo;
        return res > 0 ? res : 0;
    }

    calc() {
        let playerOneAttack = this.getAttackPoint(this.plOne);
        let playerOneDefence = this.getDefensePoint(this.plOne);
        let playerTwoAttack = this.getDefensePoint(this.plTwo);
        let playerTwoDefence = this.getDefensePoint(this.plTwo);

        // apply post point spell
        playerOneAttack = this.getPostSpellPoint(this.plTwo.DefenseSpell, playerOneAttack);
        playerOneDefence = this.getPostSpellPoint(this.plTwo.AttackSpell, playerOneDefence);
        playerTwoAttack = this.getPostSpellPoint(this.plOne.DefenseSpell, playerTwoAttack);
        playerTwoDefence = this.getPostSpellPoint(this.plOne.AttackSpell, playerTwoDefence);

        this.plOneResult.AttackPointSpelled = playerOneAttack;
        this.plOneResult.DefencePointSpelled = playerOneDefence;
        this.plTwoResult.AttackPointSpelled = playerTwoAttack;
        this.plTwoResult.DefencePointSpelled = playerTwoDefence;

        // console.log({playerOneAttack, playerOneDefence, playerTwoAttack, playerTwoDefence});

        // calculation point attack
        playerOneAttack = this.findWinner(playerOneAttack, playerTwoDefence);
        playerOneDefence = this.findWinner(playerOneDefence, playerTwoAttack);
        playerTwoAttack = this.findWinner(playerTwoAttack, playerOneDefence);
        playerTwoDefence = this.findWinner(playerTwoDefence, playerOneAttack);

        // console.log({playerOneAttack, playerOneDefence, playerTwoAttack, playerTwoDefence});

        // attack health
        const playerOneHealth = this.plOne.PlayerHealth - playerTwoAttack;
        const playerTwoHealth = this.plTwo.PlayerHealth - playerOneAttack;

        this.plOneResult.AttackPoint = playerOneAttack;
        this.plOneResult.DefensePoint = playerOneDefence;
        this.plOneResult.PlayerHealth = playerOneHealth;

        this.plTwoResult.AttackPoint = playerTwoAttack;
        this.plTwoResult.DefensePoint = playerTwoDefence;
        this.plTwoResult.PlayerHealth = playerTwoHealth;
    }
}