import {Orishas, cardSO, CardType, Spells} from "../../socket/interface/interface";

const cardDB: Map<string, cardSO> = new Map();

function setCard(cardId: Orishas, attack: number, defense: number) {
    cardDB.set(cardId, {cardType: CardType.Card, cardID: cardId, attack, defense});
}

function setSpell(cardId: Spells) {
    cardDB.set(cardId, {cardType: CardType.Spell, cardID: cardId, attack: 0, defense: 0});
}

setCard(Orishas.sango, 10, 6);
setCard(Orishas.ogun, 8, 6);
setCard(Orishas.yemoja, 4, 10);
setCard(Orishas.osun, 4, 8);
setSpell(Spells.divideByTwo);
setSpell(Spells.doubleByTwo);

export default function getCardSO(cardID: string) {
    return cardDB.get(cardID);
}