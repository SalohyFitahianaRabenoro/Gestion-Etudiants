import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

export const testConnection = async (): Promise<void> => {
    try {
        await pool.query("SELECT NOW()");
        console.log("Connexion à PostgreSQL réussie !");
    } catch (error) {
        console.error(
            "Erreur de connexion à PostgreSQL :",
            error
        );
        throw new Error("Connexion à PostgreSQL impossible");
    }
};

export default pool;