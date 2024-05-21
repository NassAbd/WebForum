import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import axios from 'axios';


// Récupération des utilisateurs et passe les données nécessaires au composant UserList pour l'affichage de la liste des utilisateurs

const UsersContainer = () => {
  // Utilisez useState pour gérer l'état local
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  // Effectuez la requête de récupération des utilisateurs lors du montage du composant
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // définir isLoading à true avant de commencer la requête
        setIsLoading(true);

        const response = await axios.get('http://localhost:8000/users');

        // Mettez à jour l'état des utilisateurs
        setUsers(response.data);

        // Une fois les données chargées, définir isLoading à false
        setIsLoading(false);
      } catch (err) {
        // gestion des erreurs et mise à jour de l'état de l'erreur
        setError(err);
        setIsLoading(false);
      }
      
    };

    fetchUsers();
  }, []); // tableau vide en tant que dépendance pour exécuter l'effet une seule fois au montage

  // passer les états aux composants UserList
  return <UserList isLoading={isLoading} users={users} error={error} />;
};

export default UsersContainer;
