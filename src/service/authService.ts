import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PublicUser, User } from "../model/user";
import userRepository from "../repositories/UserRepository";

interface TokenPayload extends JwtPayload {
    userId: number;
    username: string;
}

const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return secret;
};

const toPublicUser = (user: User): PublicUser => ({
    id: user.id,
    username: user.username
});

class AuthService {

    async register(username: string, password: string): Promise<PublicUser> {
        if (!username || !password) {
            throw new Error("Le username et le password sont obligatoires");
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await userRepository.create(username, passwordHash);

        return toPublicUser(user);
    }

    async login(username: string, password: string): Promise<{ user: PublicUser; token: string; }> {
        if (!username || !password) {
            throw new Error("Le username et le password sont obligatoires");
        }

        const user = await userRepository.findByUsername(username);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error("Identifiants incorrects");
        }

        return {
            user: toPublicUser(user),
            token: this.generateToken(user.id, user.username)
        };
    }

    async getUserFromToken(token: string): Promise<PublicUser | undefined> {
        const payload = jwt.verify(token, getJwtSecret()) as TokenPayload;
        const user = await userRepository.findById(payload.userId);

        if (!user || user.username !== payload.username) {
            return undefined;
        }

        return toPublicUser(user);
    }

    generateToken(userId: number, username: string): string {
        return jwt.sign(
            { userId, username },
            getJwtSecret(),
            { expiresIn: "1h" }
        );
    }
}

export default new AuthService();
