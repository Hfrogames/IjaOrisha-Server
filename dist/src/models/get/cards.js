"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getCardSO;
const interface_1 = require("../../socket/interface/interface");
const cardDB = new Map();
function setCard(cardId, attack, defense) {
    cardDB.set(cardId, { cardType: interface_1.CardType.Card, cardID: cardId, attack, defense });
}
function setSpell(cardId) {
    cardDB.set(cardId, { cardType: interface_1.CardType.Spell, cardID: cardId, attack: 0, defense: 0 });
}
setCard(interface_1.Orishas.sango, 10, 6);
setCard(interface_1.Orishas.ogun, 8, 6);
setCard(interface_1.Orishas.yemoja, 4, 10);
setCard(interface_1.Orishas.osun, 4, 8);
setSpell(interface_1.Spells.divideByTwo);
setSpell(interface_1.Spells.doubleByTwo);
function getCardSO(cardID) {
    return cardDB.get(cardID);
}
