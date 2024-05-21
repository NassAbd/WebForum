import React, { useState, useEffect } from 'react';
import ForumList from './ForumList';
import NewThread from './NewThread';
import axios from 'axios';
import './CSS/HomeAdmin.css';


// CODE DE DAVID
// Afficher de la liste des forums fermés sur la page d'accueil

const HomeAdmin = ({username}) => {
  // États locaux pour gérer le chargement, les forums et les erreurs
  const [isLoading, setIsLoading] = useState(false);
  const [forums, setForums] = useState([]);
  const [error, setError] = useState('');

// Fonction asynchrone pour charger les forums
const loadForums = async () => {
  try {
    // Remplacez l'URL ci-dessous par l'URL de votre API
    //const response = await fetch('/Api/forum');
    const response = await axios.get('http://localhost:8000/forums-admin');

    if (response.status >= 200 && response.status < 300) {
      // Mettez à jour l'état des forums
    setForums(response.data.messages);
    setIsLoading(false);
    setError('');
      
    }
    else{
      setIsLoading(false);
      throw new Error('Failed to fetch forums');
    }
  } catch (err) {
    // Gérez les erreurs de la requête
    setIsLoading(false);
    setError(err.toString());
  }
};


  // useEffect pour effectuer la requête initiale lors du montage du composant
  useEffect(() => {
    setIsLoading(true);
    
    // Chargez les forums
    loadForums();
  }, []); // Le tableau de dépendances est vide pour exécuter l'effet une seule fois lors du montage



  // passer les props à ForumList
  return (
    <div className="homeAdminContainer">
          <NewThread username={username} loadForums={loadForums}/>
        <ForumList isLoading={isLoading} forums={forums} error={error} admin={true}/>

      
    </div>
    
  );
};

export default HomeAdmin;
