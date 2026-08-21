# GestionEtudiant

Application de gestion des etudiants avec une API Express/TypeScript et un frontend React/Vite.

## Structure

- `server.ts` : demarrage de l'API
- `src/config` : PostgreSQL et CORS
- `src/route` : endpoints HTTP
- `src/controller` : gestion des requetes
- `src/service` : logique metier
- `src/repositories` : acces PostgreSQL
- `frontend` : interface React/Vite

## Configuration

Copier `.env.example` vers `.env`, puis renseigner PostgreSQL et `JWT_SECRET`. Le fichier `.env` reste local et ne doit pas etre versionne.

## Demarrage

Terminal 1 :

```powershell
npm run dev
```

Terminal 2 :

```powershell
npm --prefix frontend run dev
```

API : `http://localhost:3000`
Frontend : `http://localhost:5173`

## Authentification

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` avec `Authorization: Bearer <token>`

Les routes `/etudiants` sont protegees par JWT et conservent les operations GET, GET par ID, POST, PUT et DELETE.

## Verification

```powershell
npm run build
npm --prefix frontend run build
```
