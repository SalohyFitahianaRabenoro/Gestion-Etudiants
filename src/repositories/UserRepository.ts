import pool from "../config/database";
import { User } from "../model/user";

class UserRepository {

    async create(username: string, password: string): Promise<User> {
        const result = await pool.query<User>(
            `INSERT INTO users (username, password)
             VALUES ($1, $2)
             RETURNING id, username, password`,
            [username, password]
        );

        return result.rows[0];
    }

    async findByUsername(username: string): Promise<User | undefined> {
        const result = await pool.query<User>(
            "SELECT id, username, password FROM users WHERE username = $1",
            [username]
        );

        return result.rows[0];
    }

    async findById(id: number): Promise<User | undefined> {
        const result = await pool.query<User>(
            "SELECT id, username, password FROM users WHERE id = $1",
            [id]
        );

        return result.rows[0];
    }
}

export default new UserRepository();
