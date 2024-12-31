"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spells = exports.Orishas = exports.CardType = exports.SOCKET_EVENTS = void 0;
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
    Orishas["sango"] = "\u1E62\u00E0ng\u00F3";
    Orishas["ogun"] = "\u00D2g\u00FAn";
    Orishas["osun"] = "\u1ECC\u1E63un";
    Orishas["yemoja"] = "Yem\u1ECDja";
})(Orishas || (exports.Orishas = Orishas = {}));
var Spells;
(function (Spells) {
    Spells["doubleByTwo"] = "doubleByTwo";
    Spells["divideByTwo"] = "divideByTwo";
})(Spells || (exports.Spells = Spells = {}));
