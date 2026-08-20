import { PublicUser } from "../model/user";

declare global {
    namespace Express {
        interface Request {
            user?: PublicUser;
        }
    }
}

export {};
