import React, { useState } from 'react';
import { useLocation  } from 'react-router-dom';
import Avatar from './Avatar';
import axios from 'axios';

// CREER UN NOUVEAU FORUM (OUVERT OU FERME) ET GESTION DES INSCRIPTIONS EN ATTENTE POUR LES ADMINS

const NewThread = ({ username, loadForums }) => {
    const [showForm, setShowForm] = useState(false);
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [showInscriptions, setShowInscriptions] = useState(false);
    const [enAttente, setEnAttente] = useState(null);
    const location = useLocation(); 


    const onSubmit = async (subject, content) => {

        try {
            // Envoyer les données de connexion au serveur Express (lancé sur le port 8000)
            let response = null;
            if (location.pathname !== '/admin')  {  
            response = await fetch('http://localhost:8000/new-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, subject, content }), 
            });
        } else {
            response = await fetch('http://localhost:8000/new-message-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, subject, content }), 
            });
        }
    
            // Vérifier si la requête a réussi (code de statut 200)
        if (response.ok) {
            // Extraire les données JSON de la réponse
            const data = await response.json();
    
            // Vérifier la réponse du serveur
            if (data.success) {
                // Appeler la fonction de rappel pour signaler le succès
                loadForums();
            } else {
                // Afficher un message d'erreur si la connexion a échoué
                alert(data.message);
            }
        } else {
            window.alert("échec du post")
            // Gérer les erreurs de requête HTTP
            console.error('Erreur HTTP:', response.status);
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
    }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!subject.trim() || !content.trim()) {
            alert('Veuillez saisir un sujet et un contenu pour le nouveau fil de messages.');
            return;
        }
        onSubmit(subject, content );
     setSubject('');
        setContent('');
        setShowForm(false);
    };

    const Inscriptions = async () => {
        try {
          const response = await axios.get('http://localhost:8000/enAttente');
      
          if (response.status === 200) {
            // Mettez à jour l'état des forums
            
          setEnAttente(response.data); // retourne les utilisateurs attendant validation de leur inscription
          setShowInscriptions(true);
            
          }
          else{
            throw new Error('Failed to fetch forums');
          }
        } catch (err) {
          // Gérez les erreurs de la requête
        }
      };

      const chooseInscriptions = async (accept, username) => {
        try {
          if (accept){
            const response = await fetch('http://localhost:8000/acceptSignin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username}), 
            });
      
          if (response.status === 200) {
            // Mettez à jour l'état des forums
            
          Inscriptions();
            
          }
          else{
            throw new Error('Failed to fetch forums');
          }
        }
        else{
            const response = await fetch('http://localhost:8000/rejectSignin', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username}), 
            });
      
          if (response.status === 200) {
            // Mettez à jour l'état des forums
            
          Inscriptions();
            
          }
          else{
            throw new Error('Failed to fetch forums');
          }
        }
        } catch (err) {
          // Gérez les erreurs de la requête
        }
      };

    return (
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            {!showForm ? (
                <button
                    style={{ padding: '8px', margin: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}
                    onClick={() => setShowForm(true)}
                >
                    📝 Nouvelle Discussion
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="subject">Sujet :</label>
                        <input 
                            type="text" 
                            id="subject" 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)} 
                            style={{ width: '100%', padding: '10px' }} 
                            placeholder="Entrez le sujet de la discussion" 
                        />
                    </div>
                    <hr style={{ margin: '10px 0' }} />
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="content">Message :</label>
                        <textarea 
                            id="content" 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            style={{ width: '100%', padding: '10px' }} 
                            placeholder="Entrez le contenu de votre message" 
                        />
                    </div>
                    <button
                        type="submit"
                        style={{ padding: '8px', margin: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}
                    >
                        ✔️ Poster Discussion
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                         setSubject('');
                            setContent('');
                            setShowForm(false);
                        }}
                        style={{ padding: '8px', margin: '5px', backgroundColor: 'gray', color: 'white', borderRadius: '4px' }}
                    >
                        ❌ Annuler
                    </button>
                </form>
            )}

            {!showInscriptions && location.pathname === '/admin' ? (
                <button
                    style={{ padding: '8px', margin: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}
                    onClick={() => Inscriptions()}
                >
                    📝 Inscriptions en attente
                </button>
            ) : (
                <div className="home-container">
                <div className="user-wait">
                    {enAttente && enAttente.map(wait => (
                        <div key={wait._id} className="user-card" > 
                            <div className="user-header">
                                <Avatar avatar={wait.avatar} />
                                <p className="username">Username : {JSON.stringify(wait.username)}</p>
                                <p className="joined">Joined: {JSON.stringify(wait.dateJoined)}</p>
                            </div>
                            <p className="bio"><strong>Bio : </strong> {JSON.stringify(wait.bio)}</p>

                            <button
                                style={{ padding: '8px', margin: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}
                                onClick={() => chooseInscriptions(true, wait.username)}
                            >
                                📝 Accepter
                            </button>
                            <button
                            style={{ padding: '8px', margin: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}
                            onClick={() => chooseInscriptions(false, wait.username)}
                        >
                            📝 Refuser
                        </button>
                        </div>
            ))}
            {showInscriptions  && (
            <button
                    style={{ padding: '8px', margin: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}
                    onClick={() => setShowInscriptions(false)}
                >
                    📝 Fermer
                </button>
            )}
        </div>
    </div>
            )}
        </div>
    );
};

export default NewThread;
