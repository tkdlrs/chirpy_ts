import { Request, Response } from "express";

export async function handlerValidate(req: Request, res: Response) {
    let body = "";
    //
    req.on("data", (chunk) => body += chunk);
    //
    req.on("end", () => {
        try {
            const parsed = JSON.parse(body);
            //
            console.log("parsed.body.length", parsed.body.length);
            if (parsed.body.length >= 140) {
                res.status(400).send({ "error": "Chirp is too long" })
            }
            //
            res.send({
                "valid": true
            })
        } catch (error) {
            console.log("ERROR", error)
            res.status(400).send({ "error": "Something went wrong" })
        }
    });
}
