"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spellDB = exports.cardDB = void 0;
const interface_1 = require("../../socket/interface/interface");
const cardDB = [];
exports.cardDB = cardDB;
const spellDB = [];
exports.spellDB = spellDB;
function setCard(cardId, attack, defense) {
    cardDB.push({ cardType: interface_1.CardType.Card, cardID: cardId, attack, defense });
}
function setSpell(cardId) {
    spellDB.push({ cardType: interface_1.CardType.Spell, cardID: cardId, attack: 0, defense: 0 });
}
setCard(interface_1.Orishas.sango, 20, 12);
setCard(interface_1.Orishas.ogun, 16, 14);
setCard(interface_1.Orishas.osun, 10, 18);
setCard(interface_1.Orishas.yemoja, 12, 16);
setCard(interface_1.Orishas.none, 0, 0);
setCard(interface_1.Orishas.obatala, 12, 20);
setCard(interface_1.Orishas.esu, 10, 16);
setCard(interface_1.Orishas.oya, 18, 12);
setCard(interface_1.Orishas.osanyin, 14, 18);
setCard(interface_1.Orishas.oba, 16, 14);
setCard(interface_1.Orishas.olokun, 14, 18);
setSpell(interface_1.Spells.divideByTwo);
setSpell(interface_1.Spells.none);
setSpell(interface_1.Spells.doubleByTwo);
setSpell(interface_1.Spells.none);
setSpell(interface_1.Spells.none);
