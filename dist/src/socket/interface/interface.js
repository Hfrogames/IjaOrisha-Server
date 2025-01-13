"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomAgent = exports.Spells = exports.Orishas = exports.CardType = exports.SOCKET_EVENTS = void 0;
var SOCKET_EVENTS;
(function (SOCKET_EVENTS) {
    SOCKET_EVENTS["lobbyJoined"] = "lobbyJoined";
    SOCKET_EVENTS["sessionPaired"] = "sessionPaired";
    SOCKET_EVENTS["sessionJoined"] = "sessionJoined";
    SOCKET_EVENTS["sessionStart"] = "sessionStart";
    SOCKET_EVENTS["sessionEnd"] = "sessionEnd";
    SOCKET_EVENTS["formationStart"] = "formationStart";
    SOCKET_EVENTS["formationEnd"] = "formationEnd";
    SOCKET_EVENTS["battleData"] = "battleData";
})(SOCKET_EVENTS || (exports.SOCKET_EVENTS = SOCKET_EVENTS = {}));
var CardType;
(function (CardType) {
    CardType["Card"] = "Card";
    CardType["Spell"] = "Spell";
})(CardType || (exports.CardType = CardType = {}));
var Orishas;
(function (Orishas) {
    Orishas["none"] = "none";
    Orishas["sango"] = "sango";
    Orishas["ogun"] = "ogun";
    Orishas["osun"] = "osun";
    Orishas["yemoja"] = "yemoja";
    Orishas["obatala"] = "obatala";
    Orishas["esu"] = "esu";
    Orishas["oya"] = "oya";
    Orishas["osanyin"] = "osanyin";
    Orishas["oba"] = "oba";
    Orishas["olokun"] = "olokun";
})(Orishas || (exports.Orishas = Orishas = {}));
var Spells;
(function (Spells) {
    Spells["none"] = "none";
    Spells["doubleByTwo"] = "doubleByTwo";
    Spells["divideByTwo"] = "divideByTwo";
})(Spells || (exports.Spells = Spells = {}));
var RoomAgent;
(function (RoomAgent) {
    RoomAgent["Felix"] = "felix";
})(RoomAgent || (exports.RoomAgent = RoomAgent = {}));
