import { NextFunction, Request, Response } from "express";
import { TokenExpiredError } from "jsonwebtoken";
import authService from "../service/authService";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token d'authentification manquant" });

        return;
    }

    try {
        const user = await authService.getUserFromToken(authorization.slice(7));

        if (!user) {
            res.status(401).json({ message: "Utilisateur inexistant" });

            return;
        }

        req.user = user;
        next();

    } catch (error) {
        const message = error instanceof TokenExpiredError ? "Token expiré" : "Token invalide";

        res.status(401).json({ message });
    }
};
