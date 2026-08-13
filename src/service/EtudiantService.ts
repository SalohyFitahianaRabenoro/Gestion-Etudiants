import etudiantRepository from "../repositories/EtudiantRepository";
import { Etudiant } from "../model/Etudiant";

class EtudiantService {

    async getAll(): Promise<Etudiant[]> {
        return await etudiantRepository.findAll();
    }


    async getById(id: number): Promise<Etudiant | undefined> {
        return await etudiantRepository.findById(id);
    }


    async create(
        nom: string,
        age: number
    ): Promise<Etudiant> {

        if (!nom || age === undefined) {
            throw new Error("Le nom et l'âge sont obligatoires");
        }

        return await etudiantRepository.create(
            nom,
            age
        );
    }


    async update(
        id: number,
        nom: string,
        age: number
    ): Promise<Etudiant | undefined> {

        return await etudiantRepository.update(
            id,
            nom,
            age
        );
    }


    async delete(id: number): Promise<boolean> {
        return await etudiantRepository.delete(id);
    }
}

export default new EtudiantService();