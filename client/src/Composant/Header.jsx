import React, { useState, useEffect } from 'react'; // Importer useState depuis 'react'
import Navlink from './Navlink';
import UserMenu from './UserMenu';
import axios from 'axios';


const HeaderContainer = ({userName, updateConnected, staff}) => {

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Définissez isLoading à true avant de commencer la requête
        setIsLoading(true);
        console.log("userName: ", userName);

        // Faites la requête pour récupérer les utilisateurs
        //const response = await fetch('../Api/users'); // Remplacez l'URL par l'URL appropriée de votre API
        const response = await axios.get(`http://localhost:8000/user/${userName}`);

        // Mettez à jour l'état des utilisateurs
        setUserData(response.data);

        // Une fois les données chargées, définissez isLoading à false
        setIsLoading(false);
      } catch (err) {
        // Gérez les erreurs et mettez à jour l'état de l'erreur
        setError(err);
        setIsLoading(false);
      }
      
    };

    fetchUsers();
  }, [userName]);

  const name = userData ? userData.name : '';
  const username = userData ? userData.username : '';
  const avatar = userData ? userData.avatar : '';

  return (
    <div className="headerContainer">
      <Navlink />
      <UserMenu
        username={username}
        name={name}
        avatar={avatar}
        updateConnected={updateConnected}
        staff={staff}
      />
    </div>
  );
};

export default HeaderContainer;
