import {cardDB, spellDB} from "../../models/get/cards";
import {BattleData, cardSO, CardType, Orishas} from "../interface/interface";


export default class AgentBattleData {

    cardDB: Array<cardSO>;
    spellDB: Array<cardSO>;

    constructor() {
        this.cardDB = cardDB;
        this.spellDB = spellDB;
    }

    getRandom(entry: Array<cardSO>, cardType: CardType): cardSO {
        if (entry.length == 0) return this.emptyCard(cardType);

        const randomIndex = Math.floor(Math.random() * entry.length);// Get random index
        const cardSO = entry[randomIndex];
        entry.splice(randomIndex, 1);
        return cardSO; // Return the random entry
    }

    emptyCard(cardType: CardType): cardSO {
        return {
            cardType,
            cardID: Orishas.none,
            attack: 0,
            defense: 0
        }
    };

    get(): BattleData {

        const attackCard: cardSO = this.getRandom(this.cardDB, CardType.Card);
        const defenseCard: cardSO = this.getRandom(this.cardDB, CardType.Card);
        const attackSpell: cardSO = this.getRandom(this.spellDB, CardType.Spell);
        const defenseSpell: cardSO = this.getRandom(this.spellDB, CardType.Spell);

        return {
            AttackCard: attackCard.cardID,
            DefenseCard: defenseCard.cardID,
            AttackSpell: attackSpell.cardID,
            DefenseSpell: defenseSpell.cardID,
            AttackPoint: attackCard.attack,
            DefensePoint: defenseCard.defense,
            PlayerHealth: 0
        }
    }
}
