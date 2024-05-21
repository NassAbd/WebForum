import React, { useState} from 'react';
import './CSS/FormConnexion.css';

function FormConnexion({ updateConnected, updateStaff }) {
    const [username, setPseudo] = useState('');
    const [password, setPassword] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Envoyer les données de connexion au serveur Express (lancé sur le port 8000)
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Envoyer pseudo et password dans le corps de la requête
            });
    
            // Vérifier si la requête a réussi (code de statut 200)
            if (response.ok) {
                // Extraire les données JSON de la réponse
                const data = await response.json();
    
                // Vérifier la réponse du serveur
                if (data.success) {
                    // Modifier la valeur de l'attribut connected et staff dans App (connexion réussie)
                    updateConnected('True', username);
                    updateStaff(data.staff);
                } else{
                    alert(data.message);
                    console.error('Erreur HTTP:', response.status);
                }
            } else {
                // Si la réponse n'est pas ok, afficher un message d'erreur
                console.error('Erreur HTTP:', response.status);
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="pseudo">Pseudo:</label><br />
            <input type="text" id="pseudo" value={username} onChange={(e) => setPseudo(e.target.value)} /><br />
            <label htmlFor="password">Mot de passe:</label><br />
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />
            <input type="submit" value="Se connecter" />
        </form>
    );
}

export default FormConnexion;

