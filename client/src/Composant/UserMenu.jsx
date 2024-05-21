import UserNav from './Usernav';

// CODE DE DAVID
// Conteneur pour Usernav

const UserMenu = ({ username, name, avatar, updateConnected, staff}) => {
  // Affiche toujours UserNav, peu importe l'état d'authentification
  return (
    <UserNav
      username={username}
      name={name}
      avatar={avatar}
      updateConnected={updateConnected}
      staff={staff}
    />
  );
};

export default UserMenu;
