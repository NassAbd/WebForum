// Création de l'application Express
const express = require('express')
const cors = require('cors'); //npm install cors
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, '../../client/public')))

// Elements relatifs à mangoDB
const { MongoClient, ObjectId } = require('mongodb');
const url = 'mongodb://localhost:27017';
const { checkCredentials, addCredentials, envoiMessage, envoiResponse, metAdmin, enleveAdmin, valideInscription } = require('./indexDB.js');

// Configurer CORS pour autoriser les requêtes depuis localhost:3000 (port de l'appli React)
app.use(cors({ origin: 'http://localhost:3000' }));

// Définition de la route racine
app.get('/', (req, res) => { 
    res.sendFile(path.join(__dirname, 'index.html'));
})

// Utiliser body-parser middleware pour analyser les corps de requête JSON
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        // Récupérer les données de connexion de la requête
        const { username, password } = req.body;

        console.log("username: ", username);

        // Vérifier les identifiants 
        const check = await checkCredentials(username, password);

        if (check.isValid) {
            // Fermer la connexion client
            await client.close();    
        
            // Connexion réussie
            res.status(200).json({ success: true, staff: check.isStaff});
        } else if (check.message) {
            // Fermer la connexion client
            await client.close();    
        
            // Connexion échouée
            res.status(401).json({ success: false, message1: check.message });
        } else {
            // Fermer la connexion client
            await client.close();    
        
            // Connexion échouée
            res.status(401).json({ success: false, message2: 'Connexion échouée' });
        }
        
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.post('/signin', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        // Récupérer les données de connexion de la requête
        const { name, username, password, avatar, bio } = req.body;

        // Ajouter les infos de l'utilisateur 
        addCred = await addCredentials(name, username, password, avatar, bio);
        if (addCred.bool) {
            // Connexion réussie
            res.status(200).json({ success: true, username: addCred.username});

        } else if (addCred.message){
            // Connexion échouée
            res.status(401).json({ success: false, message: 'Ce pseudo existe déjà' });
        } else {
            // Connexion échouée
            res.status(401).json({ success: false, message: 'Problème lors de inscription' });
        }
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.get('/enAttente', async (req, res) => { 
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);


       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('Profil');

       // Récupérer tous les documents de la collection
       const profil = await collection.find({ is_valid: false }).toArray();

       // Fermer la connexion client
       await client.close();

       // Traiter les documents récupérés
       console.log('enAttente récupérés :', profil);

       // Envoyer les documents récupérés en tant que réponse
       res.json(profil);
       
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.get('/users', async (req, res) => { 
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('Profil');

       // Récupérer tous les documents de la collection
       //const profils = await collection.find({}).toArray();
       const profils = await collection.find({ is_valid: { $ne: false } }).toArray();

       // Fermer la connexion client
       await client.close();

       // Traiter les documents récupérés
       console.log('Documents récupérés :', profils);

       // Envoyer les documents récupérés en tant que réponse
       res.json(profils);
       
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.get('/user/:username', async (req, res) => { 
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        const username = req.params.username;

       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('Profil');

       // Récupérer tous les documents de la collection
       const profil = await collection.findOne({ username: username });

       // Fermer la connexion client
       await client.close();

       // Traiter les documents récupérés
       console.log('Documents récupérés :', profil);

       // Envoyer les documents récupérés en tant que réponse
       res.json(profil);
       
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.get('/messages/:username', async (req, res) => { 
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        const username = req.params.username;

       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('Message');

     

       // Récupérer tous les documents de la collection
       const ownM = await collection.find({
        $or: [
          { username: username },
          { "replies.username": username }
        ]
      }).toArray(); // Convertir le curseur en tableau

      const collectionAdmin = database.collection('MessageAdmin');

      const ownMAdmin = await collectionAdmin.find({
        $or: [
          { username: username },
          { "replies.username": username }
        ]
      }).toArray(); // Convertir le curseur en tableau

        
      // Traitement des documents récupérés
      const result = [];

      ownM.forEach(message => {
          // Ajouter les attributs de base
          result.push({
              _id: message._id,
              admin: message.admin,
              username: message.username,
              subject: message.subject,
              content: message.content,
              date: message.date
          });

          // Ajouter les attributs des réponses
          message.replies.forEach(reply => {
              if (reply.username === username) {
                  result.push({
                      _id: reply._id,
                      admin: message.admin,
                      username: reply.username,
                      subject: message.subject,
                      content: reply.content,
                      date: reply.date
                  });
              }
          });
      });

      ownMAdmin.forEach(message => {
        // Ajouter les attributs de base
        result.push({
            _id: message._id,
            admin: message.admin,
            username: message.username,
            subject: message.subject,
            content: message.content,
            date: message.date
        });

        // Ajouter les attributs des réponses
        message.replies.forEach(reply => {
            if (reply.username === username) {
                result.push({
                    _id: reply._id,
                    admin: message.admin,
                    username: reply.username,
                    subject: message.subject,
                    content: reply.content,
                    date: reply.date
                });
            }
        });
    });

       // Fermer la connexion client
       await client.close();

       // Traiter les documents récupérés
       console.log('own messages récupérés :', result);

       // Envoyer les documents récupérés en tant que réponse
       res.status(200).json({ success: true, message: result});
       
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.get('/forums', async (req, res) => { 
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('Message');

       // Récupérer tous les documents de la collection
       const messages = await collection.find({}).toArray();

       console.log("messages: ", messages);

       // Fermer la connexion client
       await client.close();

       // Traiter les documents récupérés
       res.status(200).json({ success: true, messages: messages});

       // Envoyer les documents récupérés en tant que réponse
       
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.get('/forums-admin', async (req, res) => { 
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('MessageAdmin');

       // Récupérer tous les documents de la collection
       const messages = await collection.find({}).toArray();

       console.log("messages: ", messages);

       // Fermer la connexion client
       await client.close();

       // Traiter les documents récupérés
       res.status(200).json({ success: true, messages: messages});

       // Envoyer les documents récupérés en tant que réponse
       
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.get('/forums/:forum', async (req, res) => { 
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        const forumId = req.params.forum;
        console.log("forumID express: ", forumId);

       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('Message');

       // Convertir forumId en ObjectId
       const objectId = new ObjectId(forumId);

       // Récupérer tous les documents de la collection
       const forum = await collection.findOne({ _id: objectId });

       // Fermer la connexion client
       await client.close();

       // Traiter les documents récupérés
       console.log('forum récupérés :', forum);

       // Envoyer les documents récupérés en tant que réponse
       res.status(200).json({ success: true, message: forum});
       
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.get('/forums-admin/:forum', async (req, res) => { 
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        const forumId = req.params.forum;
        console.log("forumID express: ", forumId);

       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('MessageAdmin');

       // Convertir forumId en ObjectId
       const objectId = new ObjectId(forumId);

       // Récupérer tous les documents de la collection
       const forum = await collection.findOne({ _id: objectId });

       // Fermer la connexion client
       await client.close();

       // Traiter les documents récupérés
       console.log('forum récupérés :', forum);

       // Envoyer les documents récupérés en tant que réponse
       res.status(200).json({ success: true, message: forum});
       
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.post('/new-message', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        // Récupérer les données de connexion de la requête
        const { username, subject, content  } = req.body;
        console.log('auteur', username);

        // Ajouter les infos de l'utilisateur 
        if (await envoiMessage(username, subject, content, false )) {
            // Connexion réussie
            res.status(200).json({ success: true});

        } else {
            // Connexion échouée
            res.status(401).json({ success: false, message: 'Problème lors du post' });
        }
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.post('/new-message-admin', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        // Récupérer les données de connexion de la requête
        const { username, subject, content  } = req.body;
        console.log('auteur', username);

        // Ajouter les infos de l'utilisateur 
        if (await envoiMessage(username, subject, content, true )) {
            // Connexion réussie
            res.status(200).json({ success: true});

        } else {
            // Connexion échouée
            res.status(401).json({ success: false, message: 'Problème lors du post' });
        }
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.post('/new-reply', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        // Récupérer les données de connexion de la requête
        const {  username, content, forumId } = req.body;

        // Convertir forumId en ObjectId
       const objectId = new ObjectId(forumId);

        // Ajouter les infos de l'utilisateur 
        if (await envoiResponse( username, content, objectId, false )) {
            // Connexion réussie
            res.status(200).json({ success: true});

        } else {
            // Connexion échouée
            res.status(401).json({ success: false, message: 'Problème lors du post' });
        }
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.post('/new-reply-admin', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        // Récupérer les données de connexion de la requête
        const {  username, content, forumId } = req.body;

        // Convertir forumId en ObjectId
       const objectId = new ObjectId(forumId);

        // Ajouter les infos de l'utilisateur 
        if (await envoiResponse( username, content, objectId, true )) {
            // Connexion réussie
            res.status(200).json({ success: true});

        } else {
            // Connexion échouée
            res.status(401).json({ success: false, message: 'Problème lors du post' });
        }
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.post('/putAdmin', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        // Récupérer les données de connexion de la requête
        const { username } = req.body;


        // Ajouter les infos de l'utilisateur 
        if (await metAdmin(username)) {
            // Connexion réussie
            res.status(200).json({ success: true});

        } else {
            // Connexion échouée
            res.status(401).json({ success: false, message: 'Problème lors du post' });
        }
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.post('/acceptSignin', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        // Récupérer les données de connexion de la requête
        const { username } = req.body;


        // Ajouter les infos de l'utilisateur 
        if (await valideInscription(username)) {
            // Connexion réussie
            res.status(200).json({ success: true});

        } else {
            // Connexion échouée
            res.status(401).json({ success: false, message: 'Problème lors du post' });
        }
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.delete('/rejectSignin', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('Profil');


       const { username } = req.body;


        // Vérifier si le message correspond à un objet de base ou à une réponse
        const user = await collection.findOne({ username: username });

        if (!user) {
            res.status(404).json({ success: false, message: 'Le user n\'a pas été trouvé.' });
            return;
        }


        // Si le message correspond à un objet de base, supprimer l'objet entier avec ses réponses
        
            await collection.deleteOne(user);
        

        // Envoyer une réponse réussie
        res.status(200).json({ success: true, message: 'Le user a été supprimé avec succès.' });
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la suppression du user:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression du user.' });
    }
});

app.post('/undoAdmin', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

        // Récupérer les données de connexion de la requête
        const { username } = req.body;


        // Ajouter les infos de l'utilisateur 
        if (await enleveAdmin(username)) {
            // Connexion réussie
            res.status(200).json({ success: true});

        } else {
            // Connexion échouée
            res.status(401).json({ success: false, message: 'Problème lors du post' });
        }
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la connexion' });
    }
});

app.delete('/del-message', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('Message');

       console.log("début del");

        const {messageId} = req.body;

       const objectId = new ObjectId(messageId);

        console.log("id del: ", objectId);

        // Vérifier si le message correspond à un objet de base ou à une réponse
        const message = await collection.findOne({ $or: [{ _id: objectId }, { 'replies._id': objectId }] });

        if (!message) {
            res.status(404).json({ success: false, message: 'Le message n\'a pas été trouvé.' });
            return;
        }

        console.log("message._id: ", message._id, "\t objectId: ", objectId);

        // Si le message correspond à un objet de base, supprimer l'objet entier avec ses réponses
        if (message._id.equals(objectId)) {
            console.log("del mess");
            await collection.deleteOne({ _id: objectId });
        } else {
            // Si le message correspond à une réponse, supprimer uniquement la réponse du tableau replies
            console.log("del reply");
            await collection.updateOne({ 'replies._id': objectId }, { $pull: { replies: { _id: objectId } } });
        }

        // Envoyer une réponse réussie
        res.status(200).json({ success: true, message: 'Le message a été supprimé avec succès.' });
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la suppression du message:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression du message.' });
    }
});

app.delete('/del-message-admin', async (req, res) => {
    try {
        // Connexion au client MongoDB
        const client = new MongoClient(url);

       // Accéder à la collection
       const database = client.db('ProjetAsso');
       const collection = database.collection('MessageAdmin');

       console.log("début del");

        const {messageId} = req.body;

       const objectId = new ObjectId(messageId);

        console.log("id del: ", objectId);

        // Vérifier si le message correspond à un objet de base ou à une réponse
        const message = await collection.findOne({ $or: [{ _id: objectId }, { 'replies._id': objectId }] });

        if (!message) {
            res.status(404).json({ success: false, message: 'Le message n\'a pas été trouvé.' });
            return;
        }

        console.log("message._id: ", message._id, "\t objectId: ", objectId);

        // Si le message correspond à un objet de base, supprimer l'objet entier avec ses réponses
        if (message._id.equals(objectId)) {
            console.log("del mess");
            await collection.deleteOne({ _id: objectId });
        } else {
            // Si le message correspond à une réponse, supprimer uniquement la réponse du tableau replies
            console.log("del reply");
            await collection.updateOne({ 'replies._id': objectId }, { $pull: { replies: { _id: objectId } } });
        }

        // Envoyer une réponse réussie
        res.status(200).json({ success: true, message: 'Le message a été supprimé avec succès.' });
    } catch (error) {
        // Gérer les erreurs
        console.error('Erreur lors de la suppression du message:', error);
        res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la suppression du message.' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
