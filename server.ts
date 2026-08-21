import express from "express";
import dotenv from "dotenv";

import etudiantRoute from "./src/route/EtudiantRoute";
import authRoute from "./src/route/authRoute";
import { testConnection } from "./src/config/database";
import { corsMiddleware } from "./src/config/cors";
import { errorMiddleware } from "./src/middleware/errorMidlleware";

dotenv.config();
console.log("JWT_SECRET chargé :", !!process.env.JWT_SECRET);
const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use("/auth", authRoute);

app.use("/etudiants", etudiantRoute);
app.use(errorMiddleware);

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

