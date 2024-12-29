import WebSocket from "ws";
import Round from "../gameSession/round";

export interface SocResponse {
    action: string,
    roomID?: string,
    playerOne?: string,
    playerOneBD?: BattleData
    playerTwo?: string,
    playerTwoBD?: BattleData
    roundTimeout?: number
    currentRound?: number
    totalRounds?: number
}

export interface BattleData {
    AttackCard: string,
    DefenseCard: string,
    AttackSpell: string,
    DefenseSpell: string,
    AttackPoint: number,
    AttackPointSpelled?: number,
    DefensePoint: number,
    DefencePointSpelled?: number,
    PlayerHealth: number,

}

export enum SOCKET_EVENTS {
    lobbyJoined = 'lobbyJoined',
    sessionPaired = 'sessionPaired',
    sessionJoined = 'sessionJoined',
    sessionStart = 'sessionStart',
    sessionEnd = 'sessionEnd',
    formationStart = 'formationStart',
    formationEnd = 'formationEnd',
    battleData = 'battleData',
}

export interface roomData {
    playerOneSoc?: WebSocket,
    playerTwoSoc?: WebSocket,
    playerOne?: string,
    playerTwo?: string,
    matchData?: Round,
    isActive: boolean,
    roomID: string,
}

export enum CardType {
    Card = "Card",
    Spell = "Spell",
}

export enum Orishas {
    sango = "Ṣàngó",
    ogun = "Ògún",
    osun = "Ọṣun",
    yemoja = "Yemọja"
}

export enum Spells {
    doubleByTwo = "doubleByTwo",
    divideByTwo = "divideByTwo",
}

export interface cardSO {
    cardType: CardType,
    cardID: Orishas | Spells,
    attack: number,
    defense: number,
}
