"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cards_1 = require("../../models/get/cards");
const interface_1 = require("../interface/interface");
class AgentBattleData {
    cardDB;
    spellDB;
    constructor() {
        this.cardDB = [...cards_1.cardDB];
        this.spellDB = [...cards_1.spellDB];
    }
    getRandom(entry, cardType) {
        if (entry.length == 0) {
            return this.emptyCard(cardType);
        }
        const randomIndex = Math.floor(Math.random() * entry.length); // Get random index
        const cardSO = entry[randomIndex];
        entry.splice(randomIndex, 1);
        return cardSO; // Return the random entry
    }
    emptyCard(cardType) {
        return {
            cardType,
            cardID: interface_1.Orishas.none,
            attack: 0,
            defense: 0
        };
    }
    ;
    get() {
        const attackCard = this.getRandom(this.cardDB, interface_1.CardType.Card);
        const defenseCard = this.getRandom(this.cardDB, interface_1.CardType.Card);
        const attackSpell = this.getRandom(this.spellDB, interface_1.CardType.Spell);
        const defenseSpell = this.getRandom(this.spellDB, interface_1.CardType.Spell);
        return {
            AttackCard: attackCard.cardID,
            DefenseCard: defenseCard.cardID,
            AttackSpell: attackSpell.cardID,
            DefenseSpell: defenseSpell.cardID,
            AttackPoint: attackCard.attack,
            DefensePoint: defenseCard.defense,
            PlayerHealth: 0
        };
    }
}
exports.default = AgentBattleData;
