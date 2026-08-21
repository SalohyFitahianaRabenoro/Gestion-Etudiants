import { RequestHandler } from "express";

const isAllowedOrigin = (origin: string | undefined): boolean => {
    if (!origin) return false;
    const configuredOrigin = process.env.CORS_ORIGIN;
    if (configuredOrigin) return origin === configuredOrigin;

    return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
};

export const corsMiddleware: RequestHandler = (req, res, next) => {
    const origin = req.headers.origin;

    if (isAllowedOrigin(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
        res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }

    next();
};
