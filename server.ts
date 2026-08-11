import express from "express";
import dotenv from "dotenv";

import etudiantRoute from "./src/route/EtudiantRoute";
import { testConnection } from "./src/config/database";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/etudiants", etudiantRoute);

const PORT = Number(process.env.PORT) || 3000;

const startServer = async (): Promise<void> => {

    await testConnection();

    app.listen(PORT, () => {
        console.log(
            `Serveur démarré sur http://localhost:${PORT}`
        );
    });
};

startServer();