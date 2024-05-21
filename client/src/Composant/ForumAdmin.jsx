import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// CODE DE DAVID
// Affichage et gestion des threads et des posts associés

function ForumAdmin({username}) {

  // États locaux pour gérer les données et les erreurs
  const [isLoading, setIsLoading] = useState(true);
  const [forumData, setForumData] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  let { forum } = useParams();


  const fetchUsers = async () => {
    try {
      // Définissez isLoading à true avant de commencer la requête
      setIsLoading(true);
      // Remplacez l'URL ci-dessous par l'URL de votre API
      //const response = await fetch('/Api/forum');
      const response = await axios.get(`http://localhost:8000/forums-admin/${forum}`);
  
      if (response.status >= 200 && response.status < 300) {
        // Mettez à jour l'état des forums
      setForumData(response.data.message);
      setIsLoading(false);
      setError('');
      console.log("forum data: ", forumData);

      
        
      }
      else{
        setIsLoading(false);
        throw new Error('Failed to fetch forum');
      }
    } catch (err) {
      // Gérez les erreurs de la requête
      setIsLoading(false);
      setError(err.toString());
    }
  };

  // Charger les données du thread lors du montage du composant
  useEffect(() => {

    

    
       fetchUsers();
    

  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  const onSubmit = async (content) => {

    try {
        // Envoyer les données de connexion au serveur Express (lancé sur le port 8000)
        const response = await fetch('http://localhost:8000/new-reply-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, content, forumId: forumData._id}), 
        });

        // Vérifier si la requête a réussi (code de statut 200)
    if (response.ok) {
        // Extraire les données JSON de la réponse
        const data = await response.json();

        // Vérifier la réponse du serveur
        if (data.success) {
            // Appeler la fonction de rappel pour signaler le succès
            fetchUsers();
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
        alert('Veuillez saisir un contenu pour le nouveau message.');
        return;
    }
    onSubmit(content );
    setContent('');
    setShowForm(false);
};

  

 

  return (
    <div className="forum">
            {
                <div key={forumData._id} className="forum-card" > 
                    <div className="forum-header">
                        <p className="username">Username : {JSON.stringify(forumData.username)}</p>
                        <p className="date">Date: {JSON.stringify(forumData.date)}</p>
                    </div>
                    <p className="suject"><strong>Sujet : </strong> {JSON.stringify(forumData.subject)}</p>
                    <div className="content"><strong>Content : </strong>{forumData.content.split('\n').map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>)}</div>

                    <div className="replies">
                        {forumData.replies.length > 0 ? (
                          forumData.replies.map(reply => (
                            <div key={reply._id} className="reply">
                              <p className="username">Username: {reply.username}</p>
                              <p className="content"><strong>Content : </strong>{reply.content}</p>
                              <p className="date">Date: {reply.date}</p>
                            </div>
                          ))
                        ) : (
                          <p>No replies posted</p>
                        )}
                    </div>
               
            </div>
          }

<div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            {!showForm ? (
                <button
                    style={{ padding: '8px', margin: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}
                    onClick={() => setShowForm(true)}
                >
                    📝 Répondre
                </button>
            ) : (
                <form onSubmit={handleSubmit}>
                    
                  
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
                        📝 Poster Réponse
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                        
                            setContent('');
                            setShowForm(false);
                        }}
                        style={{ padding: '8px', margin: '5px', backgroundColor: 'gray', color: 'white', borderRadius: '4px' }}
                    >
                        ❌ Annuler
                    </button>
                </form>
            )}
        </div>

        </div>
  );
}


export default ForumAdmin;
