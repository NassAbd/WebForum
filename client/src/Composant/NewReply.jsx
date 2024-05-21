import React, { useState } from 'react';

const NewReply = ({ username, loadForums, message_id, setReply }) => {
    const [content, setContent] = useState('');

    const onSubmit = async (content) => {
        try {
            // Envoyer les données de connexion au serveur Express (lancé sur le port 8000)
            const response = await fetch('http://localhost:8000/new-reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, content, message_id }), 
            });
    
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
        if (!content.trim()) {
            alert('Veuillez saisir un contenu pour la réponse.');
            return;
        }
        onSubmit(content );
        setContent('');
    };

    return (
        <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            
                <form onSubmit={handleSubmit}>
                    <hr style={{ margin: '10px 0' }} />
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="content">Réponse :</label>
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
                        📝 Poster Réponse
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setReply({isIt: false, id: null});
                        }}
                        style={{ padding: '8px', margin: '5px', backgroundColor: 'gray', color: 'white', borderRadius: '4px' }}
                    >
                        ❌ Annuler
                    </button>
                </form>
            
        </div>
    );
};

export default NewReply;
