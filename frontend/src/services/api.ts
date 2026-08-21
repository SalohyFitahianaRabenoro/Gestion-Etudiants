import type { CurrentUserResponse, Etudiant, EtudiantInput, LoginResponse } from "../types/api";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
const TOKEN_KEY = "gestion-etudiant.jwt";

export const tokenStorage = {
    get: (): string | null => localStorage.getItem(TOKEN_KEY),
    set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
    clear: (): void => localStorage.removeItem(TOKEN_KEY)
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = tokenStorage.get();
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401) tokenStorage.clear();
        throw new Error(body.message || `Erreur HTTP ${response.status}`);
    }

    return body as T;
}

export const api = {
    login: (username: string, password: string) =>
        request<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
    me: () => request<CurrentUserResponse>("/auth/me"),
    register: (username: string, password: string) =>
        request("/auth/register", { method: "POST", body: JSON.stringify({ username, password }) }),
    getEtudiants: () => request<Etudiant[]>("/etudiants"),
    getEtudiant: (id: number) => request<Etudiant>(`/etudiants/${id}`),
    createEtudiant: (input: EtudiantInput) =>
        request<Etudiant>("/etudiants", { method: "POST", body: JSON.stringify(input) }),
    updateEtudiant: (id: number, input: EtudiantInput) =>
        request<Etudiant>(`/etudiants/${id}`, { method: "PUT", body: JSON.stringify(input) }),
    deleteEtudiant: (id: number) => request<{ message: string }>(`/etudiants/${id}`, { method: "DELETE" })
};
