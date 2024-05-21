import React, { useState } from 'react';
import NotConnected from './Composant/NotConnected';
import Connected from './Composant/Connected';

function App() {
  const [connected, setConnected] = useState('False');
  const [username, setUsername] = useState(null);
  const [staff, setStaff] = useState(null);

  // mise à jour de l'attribut connected
  const updateConnected = (value, id) => {
   setUsername(id)
    setConnected(value);
  };

  // mise à jour de l'attribut staff (indique si l'utilisateur est admin ou pas)
  const updateStaff = (value) => {
    setStaff(value)
  }

  // Rendu conditionnel des composants en fonction du statut connecté 
  let formComponent = null;
  if (connected === 'True') {
    formComponent = <Connected username={username} staff={staff} updateConnected={updateConnected} />;
  } else {
    formComponent = <NotConnected updateConnected={updateConnected} updateStaff={updateStaff}/>;
  }

  return (
    <div>
      {formComponent}
    </div>
    
  );
}


export default App;

