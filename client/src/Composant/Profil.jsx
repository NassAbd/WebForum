import React, {useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CSS/Profil.css';

// CODE DE DAVID
// Interface utilisateur pour afficher les détails du profil d'un utilisateur

const Profil = ({userNameProp, staff}) => {
  // Utilisez useState pour gérer l'état local
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataUser, setDataUser] = useState(null);
  const [ownMessages, setOwnMessages] = useState(null);
  let { username } = useParams();


  // Effectuez la requête de récupération des utilisateurs lors du montage du composant
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Définissez isLoading à true avant de commencer la requête
        setIsLoading(true);

        // Faites la requête pour récupérer les utilisateurs
        //const response = await fetch('../Api/users'); // Remplacez l'URL par l'URL appropriée de votre API
        const response = await axios.get(`http://localhost:8000/user/${username}`);

        // Mettez à jour l'état des utilisateurs
        setDataUser(response.data);

        // Ajout de l'appel à la nouvelle requête
      const messagesResponse = await axios.get(`http://localhost:8000/messages/${username}`);
      if (messagesResponse.status === 200) {
          setOwnMessages(messagesResponse.data.message);
          console.log("own mess profil: ", messagesResponse.data.message);
      }
      


        // Une fois les données chargées, définissez isLoading à false
        setIsLoading(false);
      } catch (err) {
        // Gérez les erreurs et mettez à jour l'état de l'erreur
        setError(err);
        setIsLoading(false);
      }
      
    };

   


    fetchUsers();
  }, []); // Passez un tableau vide en tant que dépendance pour exécuter l'effet une seule fois au montage


  const delMessage = async (messageId, admin) => {

    try {
        // Envoyer les données de connexion au serveur Express (lancé sur le port 8000)
        let response;
       if (!admin){
         response = await fetch('http://localhost:8000/del-message', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messageId}), 
        });
      }
      else{
         response = await fetch('http://localhost:8000/del-message-admin', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messageId}), 
        });
      }

        // Vérifier si la requête a réussi (code de statut 200)
    if (response.ok) {
        // Extraire les données JSON de la réponse
        const data = await response.json();

        // Vérifier la réponse du serveur
        if (data.success) {
            // Appeler la fonction de rappel pour signaler le succès
            console.log("suppression réussite");
            // Mettez à jour les propres messages après la suppression réussie
            const updatedMessages = ownMessages.filter(message => message._id !== messageId);
            setOwnMessages(updatedMessages);
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

const putAdmin = async (username) => {
  try{
    const response = await fetch('http://localhost:8000/putAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }), 
        });

        // Vérifier si la requête a réussi (code de statut 200)
    if (response.ok) {
        // Extraire les données JSON de la réponse
        const data = await response.json();

        // Vérifier la réponse du serveur
        if (data.success) {
            // Appeler la fonction de rappel pour signaler le succès
        } else {
            // Afficher un message d'erreur si la connexion a échoué
            alert(data.message);
        }
    } else {
        window.alert("échec du post")
        // Gérer les erreurs de requête HTTP
        console.error('Erreur HTTP:', response.status);
    }
  }
 catch (error) {
  console.error('Erreur lors de la connexion:', error);
}
}

const undoAdmin = async (username) => {
  try{
    const response = await fetch('http://localhost:8000/undoAdmin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }), 
        });

        // Vérifier si la requête a réussi (code de statut 200)
    if (response.ok) {
        // Extraire les données JSON de la réponse
        const data = await response.json();

        // Vérifier la réponse du serveur
        if (data.success) {
            // Appeler la fonction de rappel pour signaler le succès
        } else {
            // Afficher un message d'erreur si la connexion a échoué
            alert(data.message);
        }
    } else {
        window.alert("échec du post")
        // Gérer les erreurs de requête HTTP
        console.error('Erreur HTTP:', response.status);
    }
  }
 catch (error) {
  console.error('Erreur lors de la connexion:', error);
}
}


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }



  const { name, bio, is_staff, dateJoined } = dataUser;

  return (
    <div className="profileContainer">
      <div className="profileInfo">
        <div className="name">{name}</div>
        <div className="username">
          <strong>@{username}</strong>
          {is_staff === 'true' && (
              <span style={{ color: 'red', fontSize: '12px' }}> (Staff) </span>
            )}
        </div>
        <div className="dateJoined">
          <strong>Joined: </strong>
          {dateJoined}
        </div>
        <div className="bio">
          <strong>Bio: </strong>
          {bio}
        </div>

        {staff === true && is_staff === 'false' && (
                    <button
                    style={{ padding: '8px', margin: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}
                    onClick={() => putAdmin(username)}
                >
                    Elever en admin
                </button>
                )}

        {staff === true && is_staff === 'true' && username !== userNameProp && (
                    <button
                    style={{ padding: '8px', margin: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}
                    onClick={() => undoAdmin(username)}
                >
                    Retirer état d'admin
                </button>
                )}

      </div>

     <div className="own-messages">
            {ownMessages.map(message => (
                <div key={message._id} className="own-message" > 
                    <div className="message-header">
                        <p className="username">Username : {JSON.stringify(message.username)}</p>
                        <p className="date">Date: {JSON.stringify(message.date)}</p>
                    </div>
                    <p className="suject"><strong>Sujet : </strong> {JSON.stringify(message.subject)}</p>
                    <div className="content"><strong>Content : </strong>{message.content.split('\n').map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>)}</div>

                    {message.username === userNameProp && username === userNameProp && (
                    <button
                    style={{ padding: '8px', margin: '5px', backgroundColor: 'blue', color: 'white', borderRadius: '4px' }}
                    onClick={() => delMessage(message._id, message.admin)}
                >
                    ❌ Supprimer Message
                </button>
                )}
            </div>
            ))}
          </div>
    </div>
  );
};

export default Profil;
