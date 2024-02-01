import jwt from "jsonwebtoken";
import { jwt_secret_key } from "../config/index.js";

export async function verifyToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, jwt_secret_key, (err, user) => {
        if (err) return res.status(403).json({ error: 'Forbidden' });

        req.user = user;
        next();
    });
};