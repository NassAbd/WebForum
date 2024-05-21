import React, { useState, useEffect } from 'react';
import ForumList from './ForumList';
import NewThread from './NewThread';
import axios from 'axios';


// Afficher de la liste des forums publics sur la page d'accueil

const HomeContainer = ({username}) => {
  // États locaux pour gérer le chargement, les forums et les erreurs
  const [isLoading, setIsLoading] = useState(false);
  const [forums, setForums] = useState([]);
  const [error, setError] = useState('');

// Fonction asynchrone pour charger les forums
const loadForums = async () => {
  try {
    const response = await axios.get('http://localhost:8000/forums');

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
    // Gérer les erreurs de la requête
    setIsLoading(false);
    setError(err.toString());
  }
};


  // Effectuer la requête initiale lors du montage du composant
  useEffect(() => {
    setIsLoading(true);
    
    // Chargez les forums
    loadForums();
  }, []); // Le tableau de dépendances est vide pour exécuter l'effet une seule fois lors du montage



  return (
    <div className="homeContainer">
          <NewThread username={username} loadForums={loadForums}/>
        <ForumList isLoading={isLoading} forums={forums} error={error} admin={false}/>

      
    </div>
    
  );
};

export default HomeContainer;
