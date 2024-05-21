const {MongoClient, ObjectId} = require('mongodb');
const url = "mongodb://localhost:27017";

const client = new MongoClient(url);
const dbName="ProjetAsso";

async function main() {
    try {
        // Connexion à la base de données
        await client.connect();
        console.log("Connexion à la base de données réussie.");
    } catch (error) {
        console.error("Erreur lors de la connexion à la base de données :", error);
    }
}

main();

// Fonction pour vérifier l'identifiant et le mot de passe dans la base de données
async function checkCredentials(username, password) {

    try {
        if (!username || !password) {
            console.error("Nom d'utilisateur ou mot de passe manquant.");
            return false;
        }

        // Obtenir la référence de la base de données
        const db = client.db(dbName);

        // Obtenir la référence de la collection contenant les utilisateurs
        const usersCollection = db.collection('Profil');

        // Rechercher l'utilisateur dans la collection
        const user = await usersCollection.findOne({ username: username, password: password });

        // Vérifier si l'utilisateur a été trouvé
        if (user !== null) {
            console.log("L'utilisateur a été trouvé dans la base de données.");
            if (user.is_valid){
            return { isValid: true, isStaff: user.is_staff === 'true' };
            }
            else {
                return { isValid: false, message: "compte en attente de validation" };
            }
        } else {
            console.log("L'utilisateur n'a pas été trouvé dans la base de données.");
            return  { isValid: false, isStaff: false};
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la vérification des identifiants :", error);
        return false;
    } 
}


// Fonction pour enregistrer un nouvel utilisateur dans la BDD
async function addCredentials(name, username, password, avatar, bio) {

    try {

        // Obtenir la référence de la base de données
        const db = client.db(dbName);

        // Vérifier d'abord si un objet avec le même profil_id existe déjà
        const existingUser = await db.collection("Profil").findOne({ username: username });
        if (existingUser) {
            // Un utilisateur avec le même profil_id existe déjà
            console.log("Un utilisateur avec le même username existe déjà.");
            return { bool: false, message: "Un utilisateur avec le même username existe déjà." };
        }

        //_id: Date.now(),
        const newMessage = 
        {
            name: name,
            username: username,
            bio: bio,
            avatar: avatar,
            is_staff: "false",
            dateJoined: new Date(Date.now()).toLocaleDateString('fr-FR'),
            password: password,
            is_valid: false
        }
        // Insérer le nouvel utilisateur dans la collection
        await db.collection("Profil").insertOne(newMessage);
        console.log("Nouvel utilisateur ajouté avec succès.");
        //return true;
        return { bool: true, idP: newMessage.username };
        } catch (erreur) {
            console.error(erreur);
            return false;
        } 
}

async function envoiMessage(username, subject, content, admin){
    try {

        // Obtenir la référence de la base de données
        const db = client.db(dbName);


        const newMessage = {
            _id: new ObjectId(),
            admin: admin,
            username: username,
            subject: subject,
            content: content,
            date: new Date().toLocaleString('fr-FR'),
            replies: []
        }
        // Insérer le nouvel utilisateur dans la collection
        if (!admin){
        await db.collection("Message").insertOne(newMessage);
        } else {
            await db.collection("MessageAdmin").insertOne(newMessage);
        }
        console.log("Message posté avec succès.");
        return true;
        } catch (erreur) {
            console.error(erreur);
            return false;
        } 
}

async function envoiResponse(username, content, forumId, admin){
    try {

        // Obtenir la référence de la base de données
        const db = client.db(dbName);

        console.log("message id: ", forumId);

        // Vérifier si le message existe dans la base de données
        
        const message1 = await db.collection("Message").findOne({ _id: forumId });
        
        const message2 = await db.collection("MessageAdmin").findOne({ _id: forumId });
        


        if (!message1 && !message2) {
            console.error("Le message avec l'ID spécifié n'existe pas.");
            return false;
        }

        const newResponse = {
            _id: new ObjectId(),
            admin: admin,
            username: username,
            content: content,
            date: new Date().toLocaleString('fr-FR')
        }
        
        // Ajouter la réponse à la liste des réponses du message

        // Mettre à jour le message dans la base de données
        if (!admin){
            message1.replies.push(newResponse);
        await db.collection("Message").updateOne(
            { _id: forumId },
            { $set: { replies: message1.replies } }
        );
    } else {
        message2.replies.push(newResponse);

        await db.collection("MessageAdmin").updateOne(
            { _id: forumId },
            { $set: { replies: message2.replies } }
        );
    }

        console.log("Message posté avec succès.");
        return true;
        } catch (erreur) {
            console.error(erreur);
            return false;
        } 
}

async function metAdmin(username){
    try {

        // Obtenir la référence de la base de données
        const db = client.db(dbName);

        // Vérifier d'abord si un objet avec le même profil_id existe déjà
        const user = await db.collection("Profil").findOne({ username: username });
       
        if (user){
        // Mettre à jour l'utilisateur pour définir le rôle d'administrateur
        await db.collection("Profil").updateOne(
            { username: username },
            { $set: { is_staff: 'true' } }
        );
        // Insérer le nouvel utilisateur dans la collection
        console.log("Nouvel utilisateur ajouté avec succès.");
        //return true;
        return true;
    }
        else {
            console.log(`L'utilisateur ${username} n'existe pas dans la base de données.`);
            return false;
        }
        } catch (erreur) {
            console.error(erreur);
            return false;
        } 
}

async function enleveAdmin(username){
    try {

        // Obtenir la référence de la base de données
        const db = client.db(dbName);

        // Vérifier d'abord si un objet avec le même profil_id existe déjà
        const user = await db.collection("Profil").findOne({ username: username });
       
        if (user){
        // Mettre à jour l'utilisateur pour définir le rôle d'administrateur
        await db.collection("Profil").updateOne(
            { username: username },
            { $set: { is_staff: 'false' } }
        );
        // Insérer le nouvel utilisateur dans la collection
        console.log("Nouvel utilisateur ajouté avec succès.");
        //return true;
        return true;
    }
        else {
            console.log(`L'utilisateur ${username} n'existe pas dans la base de données.`);
            return false;
        }
        } catch (erreur) {
            console.error(erreur);
            return false;
        } 
}

async function valideInscription(username){
    try {

        // Obtenir la référence de la base de données
        const db = client.db(dbName);

        // Vérifier d'abord si un objet avec le même profil_id existe déjà
        const user = await db.collection("Profil").findOne({ username: username });
       
        if (user){
        // Mettre à jour l'utilisateur pour définir le rôle d'administrateur
        await db.collection("Profil").updateOne(
            { username: username },
            { $set: { is_valid: true } }
        );
        // Insérer le nouvel utilisateur dans la collection
        console.log("Nouvel utilisateur ajouté avec succès.");
        //return true;
        return true;
    }
        else {
            console.log(`L'utilisateur ${username} n'existe pas dans la base de données.`);
            return false;
        }
        } catch (erreur) {
            console.error(erreur);
            return false;
        } 
}

module.exports = { checkCredentials, addCredentials, envoiMessage, envoiResponse, metAdmin, enleveAdmin, valideInscription };

