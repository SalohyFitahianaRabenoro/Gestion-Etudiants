import { Router } from "express";
import etudiantController from "../controller/EtudiantController";

const router = Router();

router.get("/", etudiantController.getAll);

router.get("/:id", etudiantController.getById);

router.post("/", etudiantController.create);

router.put("/:id", etudiantController.update);

router.delete("/:id", etudiantController.delete);

export default router;