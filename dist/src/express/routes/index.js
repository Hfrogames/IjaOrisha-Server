"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
exports.default = () => {
    const route = (0, express_1.Router)();
    route.get('/', (req, res) => {
        res.json({ message: "hello world" });
    });
    return route;
};
