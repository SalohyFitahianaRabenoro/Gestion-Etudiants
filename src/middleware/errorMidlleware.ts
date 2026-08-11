import {
    Request,
    Response,
    NextFunction
} from "express";

export const errorMiddleware = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    console.error(error);

    res.status(500).json({
        message: "Erreur interne du serveur"
    });
};