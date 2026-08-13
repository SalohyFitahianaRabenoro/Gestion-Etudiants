import pool from "../config/database";
import { Etudiant } from "../model/Etudiant";

class EtudiantRepository {

    async findAll(): Promise<Etudiant[]> {

        const result = await pool.query(
            "SELECT * FROM etudiants ORDER BY id"
        );

        return result.rows;
    }


    async findById(id: number): Promise<Etudiant | undefined> {

        const result = await pool.query(
            "SELECT * FROM etudiants WHERE id = $1",
            [id]
        );

        return result.rows[0];
    }


    async create(
        nom: string,
        age: number
    ): Promise<Etudiant> {

        const result = await pool.query(
            `INSERT INTO etudiants (nom, age)
             VALUES ($1, $2)
             RETURNING *`,
            [nom, age]
        );

        return result.rows[0];
    }


    async update(
        id: number,
        nom: string,
        age: number
    ): Promise<Etudiant | undefined> {

        const result = await pool.query(
            `UPDATE etudiants
             SET nom = $1,
                 age = $2
             WHERE id = $3
             RETURNING *`,
            [nom, age, id]
        );

        return result.rows[0];
    }


    async delete(id: number): Promise<boolean> {

        const result = await pool.query(
            "DELETE FROM etudiants WHERE id = $1",
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }
}

export default new EtudiantRepository();