import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api, tokenStorage } from "./services/api";
import type { Etudiant, EtudiantInput, User } from "./types/api";

const emptyEtudiant: EtudiantInput = { nom: "", age: 18 };

export default function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
    const [form, setForm] = useState<EtudiantInput>(emptyEtudiant);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [lookupId, setLookupId] = useState("");
    const [message, setMessage] = useState("Connectez-vous pour accéder aux routes protégées.");
    const [error, setError] = useState("");

    const run = async (action: () => Promise<void>) => {
        setError("");
        try {
            await action();
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Une erreur est survenue");
            if (!tokenStorage.get()) setUser(null);
        }
    };

    const loadEtudiants = () => run(async () => {
        const data = await api.getEtudiants();
        setEtudiants(data);
        setMessage(`${data.length} étudiant(s) récupéré(s).`);
    });

    useEffect(() => {
        if (tokenStorage.get()) {
            void run(async () => {
                const result = await api.me();
                setUser(result.user);
                setMessage(`Session restaurée : ${result.user.username}.`);
                await loadEtudiants();
            });
        }
    }, []);

    const login = (event: FormEvent) => {
        event.preventDefault();
        void run(async () => {
            const result = await api.login(username, password);
            tokenStorage.set(result.token);
            setUser(result.user);
            setPassword("");
            setMessage(`Connexion réussie : ${result.user.username}. Le JWT est maintenant envoyé automatiquement.`);
            await loadEtudiants();
        });
    };

    const register = (event: FormEvent) => {
        event.preventDefault();
        void run(async () => {
            await api.register(username, password);
            setPassword("");
            setIsRegistering(false);
            setMessage("Compte créé. Connectez-vous maintenant avec ces identifiants.");
        });
    };

    const saveEtudiant = (event: FormEvent) => {
        event.preventDefault();
        void run(async () => {
            if (editingId === null) {
                await api.createEtudiant(form);
                setMessage("Étudiant créé.");
            } else {
                await api.updateEtudiant(editingId, form);
                setMessage("Étudiant modifié.");
            }
            setForm(emptyEtudiant);
            setEditingId(null);
            await loadEtudiants();
        });
    };

    const findEtudiant = (event: FormEvent) => {
        event.preventDefault();
        void run(async () => {
            const result = await api.getEtudiant(Number(lookupId));
            setMessage(`Résultat : ${result.nom}, ${result.age} ans (id ${result.id}).`);
        });
    };

    const deleteEtudiant = (id: number) => void run(async () => {
        if (!window.confirm("Supprimer cet étudiant ?")) return;
        const result = await api.deleteEtudiant(id);
        setMessage(result.message);
        await loadEtudiants();
    });

    const logout = () => {
        tokenStorage.clear();
        setUser(null);
        setEtudiants([]);
        setMessage("Déconnecté : le JWT a été retiré du navigateur.");
    };

    return (
        <main className="app-shell">
            <header className="site-header">
                <div className="brand">
                    <span className="brand-mark">GE</span>
                    <div><p className="eyebrow">Administration</p><h1>Gestion des étudiants</h1></div>
                </div>
                {user && <div className="account-bar"><span>Connecté en tant que <strong>{user.username}</strong></span><button className="secondary" onClick={logout}>Se déconnecter</button></div>}
            </header>

            {!user ? (
                <section className="card login-card">
                    <div className="card-heading"><p className="eyebrow">Espace sécurisé</p><h2>{isRegistering ? "Créer un compte" : "Bienvenue"}</h2><p className="muted">{isRegistering ? "Créez vos identifiants pour accéder à l'application." : "Connectez-vous pour gérer les étudiants."}</p></div>
                    <form onSubmit={isRegistering ? register : login}>
                        <label htmlFor="username">Nom d'utilisateur<input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
                        <label htmlFor="password">Mot de passe<input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
                        <button type="submit" className="full-button">{isRegistering ? "Créer le compte" : "Se connecter"}</button>
                    </form>
                    <button className="link-button" onClick={() => { setIsRegistering(!isRegistering); setError(""); }}>
                        {isRegistering ? "J’ai déjà un compte" : "Créer un compte de test"}
                    </button>
                </section>
            ) : (
                <div className="dashboard">
                    <div className="page-intro"><div><p className="eyebrow">Tableau de bord</p><h2>Étudiants</h2><p className="muted">Consultez et gérez les étudiants enregistrés.</p></div><button onClick={loadEtudiants}>Actualiser la liste</button></div>
                    <div className="workspace">
                    <section className="card student-card">
                        <form className="inline-form" onSubmit={findEtudiant}>
                            <label htmlFor="lookup-id">Rechercher par identifiant</label><div className="search-row"><input id="lookup-id" type="number" min="1" placeholder="Ex. 12" value={lookupId} onChange={(e) => setLookupId(e.target.value)} required /><button type="submit" className="secondary">Rechercher</button></div>
                        </form>
                        <div className="student-table" role="table" aria-label="Liste des étudiants">
                            <div className="table-row table-header" role="row"><span>Nom</span><span>Âge</span><span>Actions</span></div>
                            {etudiants.length === 0 ? <p className="empty-state">Aucun étudiant à afficher.</p> : etudiants.map((student) => (
                                <div className="table-row" role="row" key={student.id}>
                                    <span><strong>{student.nom}</strong><small>ID {student.id}</small></span><span>{student.age} ans</span>
                                    <span className="actions">
                                        <button className="secondary" onClick={() => { setEditingId(student.id); setForm({ nom: student.nom, age: student.age }); }}>Modifier</button>
                                        <button className="danger" onClick={() => deleteEtudiant(student.id)}>Supprimer</button>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="card form-card">
                        <h2>{editingId === null ? "Nouvel étudiant" : `Modifier l'étudiant #${editingId}`}</h2>
                        <p className="muted">{editingId === null ? "Ajoutez un étudiant à la liste." : "Mettez à jour les informations."}</p>
                        <form onSubmit={saveEtudiant}>
                            <label htmlFor="student-name">Nom<input id="student-name" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required /></label>
                            <label htmlFor="student-age">Âge<input id="student-age" type="number" min="0" value={form.age} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })} required /></label>
                            <div className="actions"><button type="submit">{editingId === null ? "Créer" : "Enregistrer"}</button>{editingId !== null && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyEtudiant); }}>Annuler</button>}</div>
                        </form>
                    </section>
                    </div>
                </div>
            )}
            {message && <p className="notice success" role="status">{message}</p>}
            {error && <p className="notice error" role="alert">{error}</p>}
        </main>
    );
}
