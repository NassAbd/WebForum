import React, { useState } from 'react';
import './CSS/FormInscription.css';


function FormInscription({handleFormChange}) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bio, setBio] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Envoyer les données de connexion au serveur Express (lancé sur le port 8000)
            const response = await fetch('http://localhost:8000/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, username, password, avatar, bio }), // Envoyer name, username, etc dans le corps de la requête
            });

            // Vérifier si la requête a réussi (code de statut 200)
        if (response.ok) {
            // Extraire les données JSON de la réponse
            const data = await response.json();

            // Vérifier la réponse du serveur
            if (data.success) {
                handleFormChange(null);
                alert("attendez validation par admins"); // inscription soumise à l'accord d'un admin
            } else {
                // Afficher un message d'erreur si la connexion a échoué
                alert(data.message);
            }
        } else {
            const data = await response.json();
            window.alert(data.message);
            // Gérer les erreurs de requête HTTP
            console.error('Erreur HTTP:', response.status);
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
    }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label><br />
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} /><br />
            <label htmlFor="pseudo">Pseudo:</label><br />
            <input type="text" id="pseudo" value={username} onChange={(e) => setUsername(e.target.value)} /><br />
            <label htmlFor="password">Mot de passe:</label><br />
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br /><br />
            <label htmlFor="avatar">IRL de votre avatar:</label><br />
            <input type="avatar" id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} /><br />
            <label htmlFor="bio">Rédiger une courte présentation:</label><br />
            <input type="bio" id="bio" value={bio} onChange={(e) => setBio(e.target.value)} /><br />
            <input type="submit" value="S'inscrire" />
        </form>
    );
}

export default FormInscription;
