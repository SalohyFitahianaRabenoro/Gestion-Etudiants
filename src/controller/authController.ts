import { Request, Response } from "express";
import authService from "../service/authService";

class AuthController {

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, password } = req.body;
            const user = await authService.register(username, password);

            res.status(201).json({ user });

        } catch (error) {
            const databaseError = error as { code?: string; message: string; };
            const status = databaseError.code === "23505" ? 409 : 400;

            res.status(status).json({
                message: databaseError.code === "23505"
                    ? "Ce username existe déjà"
                    : databaseError.message
            });
        }
    };

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { username, password } = req.body;
            const result = await authService.login(username, password);

            res.status(200).json(result);

        } catch (error) {
            const message = (error as Error).message;
            const status = message === "Identifiants incorrects" ? 401 : 400;

            res.status(status).json({ message });
        }
    };
}

export default new AuthController();
