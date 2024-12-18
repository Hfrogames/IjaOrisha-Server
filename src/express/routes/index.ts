import { Request, Response, Router } from "express";

export default () => {
    const route = Router();

    route.get('/', (req, res) => {
        res.json({ message: "hello world" });
    })

    return route;
}