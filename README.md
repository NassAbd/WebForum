# Organiz’asso - Site Web associatif

Le site Organiz’asso permet à des membres d’une association d’échanger des messages avec des forums.

## Fonctionnalités

L’association est pilotée par un conseil d’administration, composé de membres élus appelés administrateurs. Elle dispose de deux forums :

- **Forum ouvert** : Accessible à chaque membre inscrit, qui peut consulter et poster des messages.
- **Forum fermé** : Réservé aux membres du conseil d’administration.

### Hors Connexion

Un utilisateur non connecté peut uniquement créer un compte. Son inscription doit être validée par un administrateur pour lui attribuer le statut de membre.

### Lorsqu’un membre se connecte

Lorsqu’un membre se connecte, il accède à une page principale contenant le forum ouvert. Une fois connecté, un membre peut :

- **Créer des messages** :
  - En réponse à un message précédemment posté.
  - Pour démarrer une nouvelle discussion.
- **Visualiser son profil** :
  - Contient la liste des messages publiés par le membre.
  - Le membre peut supprimer ses propres messages à partir de son profil.
- **Visualiser le profil d’autres membres**.

### Les Administrateurs

Les administrateurs ont des privilèges supplémentaires :

- Accès au forum fermé.
- Attribution et retrait du statut d’administrateur à un autre utilisateur (sauf à eux-mêmes).
- Revue des inscriptions sur le site, et validation ou non du statut de membre pour les utilisateurs inscrits.

### Déconnexion

À la fin de son activité, l’utilisateur a la possibilité de se déconnecter.


## Captures d'écran

![Motus Screenshot](./imageWeb1.png)
![Motus Screenshot](./imageWeb3.png)
![Motus Screenshot](./imageWeb4.png)

## Utilisation

1. Ouvrez l'application dans votre navigateur.
2. Se connecter / S'inscrire
3. Recevez des indices visuels après chaque tentative.
4. Une fois le mot deviné ou les tentatives épuisées, la définition du mot sera affichée.

## Architecture du projet

- **src/Components** : Contient les composants React.
- **src/CSS** : Contient les fichiers CSS pour le style de l'application.
- **public** : Contient les fichiers statiques et le fichier HTML de base.

## Exemple de code

### Composant `HomeContainer`

```javascript
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
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

