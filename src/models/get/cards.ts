import {Orishas, cardSO, CardType, Spells} from "../../socket/interface/interface";

const cardDB: Array<cardSO> = [];
const spellDB: Array<cardSO> = [];

function setCard(cardId: Orishas, attack: number, defense: number) {
    cardDB.push({cardType: CardType.Card, cardID: cardId, attack, defense});
}

function setSpell(cardId: Spells) {
    spellDB.push({cardType: CardType.Spell, cardID: cardId, attack: 0, defense: 0});
}

setCard(Orishas.sango, 20, 12);
setCard(Orishas.ogun, 16, 14);
setCard(Orishas.osun, 10, 18);
setCard(Orishas.yemoja, 12, 16);
setCard(Orishas.none, 0, 0);
setCard(Orishas.obatala, 12, 20);
setCard(Orishas.esu, 10, 16);
setCard(Orishas.oya, 18, 12);
setCard(Orishas.osanyin, 14, 18);
setCard(Orishas.oba, 16, 14);
setCard(Orishas.olokun, 14, 18);

setSpell(Spells.divideByTwo);
setSpell(Spells.none);
setSpell(Spells.doubleByTwo);
setSpell(Spells.none);
setSpell(Spells.none);

export {cardDB, spellDB};