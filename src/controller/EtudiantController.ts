import { Request, Response } from "express";
import etudiantService from "../service/EtudiantService";

class EtudiantController {

    // GET /etudiants
    getAll = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {

            const etudiants = await etudiantService.getAll();

            res.status(200).json(etudiants);

        } catch (error) {

            res.status(500).json({
                message: "Erreur lors de la récupération des étudiants"
            });
        }
    };


    // GET /etudiants/:id
    getById = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {

            const id = Number(req.params.id);

            const etudiant =
                await etudiantService.getById(id);

            if (!etudiant) {

                res.status(404).json({
                    message: "Étudiant non trouvé"
                });

                return;
            }

            res.status(200).json(etudiant);

        } catch (error) {

            res.status(500).json({
                message: "Erreur lors de la récupération de l'étudiant"
            });
        }
    };


    // POST /etudiants
    create = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {

            const { nom, age } = req.body;

            const etudiant =
                await etudiantService.create(
                    nom,
                    Number(age)
                );

            res.status(201).json(etudiant);

        } catch (error) {

            res.status(400).json({
                message: (error as Error).message
            });
        }
    };


    // PUT /etudiants/:id
    update = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {

            const id = Number(req.params.id);

            const { nom, age } = req.body;

            const etudiant =
                await etudiantService.update(
                    id,
                    nom,
                    Number(age)
                );

            if (!etudiant) {

                res.status(404).json({
                    message: "Étudiant non trouvé"
                });

                return;
            }

            res.status(200).json(etudiant);

        } catch (error) {

            res.status(500).json({
                message: "Erreur lors de la modification"
            });
        }
    };


    // DELETE /etudiants/:id
    delete = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {

            const id = Number(req.params.id);

            const deleted =
                await etudiantService.delete(id);

            if (!deleted) {

                res.status(404).json({
                    message: "Étudiant non trouvé"
                });

                return;
            }

            res.status(200).json({
                message: "Étudiant supprimé avec succès"
            });

        } catch (error) {

            res.status(500).json({
                message: "Erreur lors de la suppression"
            });
        }
    };
}

export default new EtudiantController();