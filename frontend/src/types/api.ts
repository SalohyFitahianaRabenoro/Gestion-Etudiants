export interface User {
    id: number;
    username: string;
}

export interface LoginResponse {
    user: User;
    token: string;
}

export interface CurrentUserResponse {
    user: User;
}

export interface Etudiant {
    id: number;
    nom: string;
    age: number;
}

export interface EtudiantInput {
    nom: string;
    age: number;
}
