import React, { useState } from 'react';
import './CSS/NotConnected.css'
import FormConnexion from './FormConnexion';
import FormInscription from './FormInscription';

//COMPOSANT REPRESENTANT LA PAGE DE CONNEXION/INSCRIPTION

function NotConnected({ updateConnected, updateStaff }) {
    const [activeForm, setActiveForm] = useState(null);
  
    // Fonction pour changer le formulaire actif
    const handleFormChange = (form) => {
      setActiveForm(form);
    };
  
   
  
    // Rendu conditionnel des composants en fonction de activeForm
    let formComponent = null;
    if (activeForm === 'connexion') {
      formComponent = <FormConnexion updateConnected={updateConnected} updateStaff={updateStaff}/>;
    } else if (activeForm === 'inscription') {
      formComponent = <FormInscription handleFormChange={handleFormChange}/>;
    }
  
    return (
      <div>
        <header>
          <title>Organiz Assos</title>
          <h1 className="center-title">Bienvenue sur Organiz'Asso</h1>
        </header>
        <nav className="menu">
          <div className="center-buttons">
            <button className="button" onClick={() => handleFormChange('connexion')}>
              Se connecter
            </button>
            <button className="button" onClick={() => handleFormChange('inscription')}>
              S'inscrire
            </button>
          </div>
        </nav>
        {formComponent}
      </div>
    );
  }
  
  export default NotConnected;
  