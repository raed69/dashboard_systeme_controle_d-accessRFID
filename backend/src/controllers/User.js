const { where, Op, Model } = require('sequelize');
const Addcarte = require('../fonctions/FOR_USER/Addcarts');
const { calculer_nombre_carte } = require('../fonctions/FOR_USER/Calcuer_nombre_carte');
const { alias_genere } = require('../fonctions/FOR_USER/Generer_alias')
const Carte = require('../models/Carte')
const User=require('../models/User');
const { publishCardDataToBroker } = require('../service broker/publish/clientcarte');
const Timezone_Jours_Timeslot = require('../models/Timezone_jours_timeslot');
const { recuperer_details_timezone } = require('./Timezon');
const Jours_Timeslot = require('../models/Jours_Timeslot');
const Timeslot = require('../models/Timeslot');
const Timezone = require('../models/Timezone');
const Jours = require('../models/Jours');



const creer_user_avec_sa_carte = async (req, res, next) => {
    try {
        const { nom, prenom, cin, email, telephone, photo,nomber_carte } = req.body;
        const existingUser = await User.findOne({ where: { cin: cin } });

        if (existingUser) {
            return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
        }

        const carteLibre = await Carte.findOne({ where: { id_user: null } });

        if (!carteLibre) {
            return res.status(400).json({ message: 'Désolé, aucune carte libre disponible.' });
        }

        const aliasGenere = alias_genere(nom, prenom, cin);

        const newUser = await User.create({
            nom: nom,
            prenom: prenom,
            cin: cin,
            alias: aliasGenere,
            email: email,
            telephone: telephone,
            photo: photo,
            nomber_carte:nomber_carte,
        });


        const associeeCarteUser = Carte.update(
            { id_user: newUser.id_user, 
              propritaire:newUser.nom +' '+ newUser.prenom
            },
            { where: { id_carte: carteLibre.id_carte } }
        );

        
        await Promise.all([associeeCarteUser]);
        
        return res.status(200).json({ message: 'Nouvel utilisateur créé avec succès!' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Problème lors de la création de l\'utilisateur.' });
    }
};
///////////////////////////////////////////////////


const Update_user_carte = async (req, res, next) => {
    try {
      const { statut, nombre_max_entree, date_expiration, id_timezone } = req.body;
  
      // Vérifiez si le dernier utilisateur existe
      const id_last_user = await User.max('id_user');
      const lastcreated_user = await User.findOne({ where: { id_user: id_last_user } });
  
      if (!lastcreated_user) {
        console.log("Aucun utilisateur trouvé avec cet ID");
        return res.status(404).json({ message: "Aucun utilisateur n'existe avec cet ID" });
      }
  
      console.log("Utilisateur trouvé:", lastcreated_user);
  
      // Préparer les données de mise à jour
      const nom_last_user = lastcreated_user.nom;
      const prenom_last_user = lastcreated_user.prenom;
  
      let updateData = {
        statut,
        nombre_max_entree,
        date_expiration,
        id_timezone,
        propritaire: `${nom_last_user} ${prenom_last_user}`
      };
  
      
      const statut_selectee = statut.toLowerCase(); // Utilisez `toLowerCase` pour éviter les problèmes de casse
  
      if (statut_selectee === 'vip') {
        console.log("Statut VIP sélectionné");
        updateData.nombre_max_entree = 999999999;
        updateData.id_timezone= null; // Assurez-vous que cela a un sens dans votre contexte
       
      } else if (statut_selectee === 'blackliste') {
        console.log("Statut Blackliste sélectionné");
        updateData.nombre_max_entree = -99999999999;
        updateData.id_timezone= null
      }
  
      // Mettre à jour la carte
      const updateResult = await Carte.update(updateData, { where: { id_user: lastcreated_user.id_user } });
  
      // Vérifier si la mise à jour a réussi
      if (updateResult[0] === 0) {
        console.log("Aucune ligne mise à jour");
        return res.status(404).json({ message: "Aucune carte trouvée pour cet utilisateur." });
      }
  
      // Récupérer la carte mise à jour
      const updatedCardData = await Carte.findOne({ where: { id_user: lastcreated_user.id_user } });
  
      // Publier les données de la carte mise à jour
      await publishCardDataToBroker(updatedCardData);
  
      return res.status(200).json({ message: "Les informations de la carte utilisateur ont été mises à jour avec succès." });
  
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la carte utilisateur:", error);
      return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour des informations de la carte utilisateur." });
    }
  };
  
  
//////////////////////////////////////////////////

const Addothercartetouser = async (req, res, next) => {
    try {
        const userId = req.params.id_user;
        const { statut, nombre_max_entree, date_expiration, id_timezone } = req.body;

        // Ajouter une carte à l'utilisateur
        await Addcarte(userId);

        // Trouver la carte ajoutée récemment à l'utilisateur
        const carteAddedToUser = await Carte.findOne({ 
            where: { id_user: userId },
            order: [['id_carte', 'DESC']] // Trie par id_carte en ordre descendant pour obtenir la carte la plus récente
        });

        // Mettre à jour les détails de la dernière carte ajoutée à l'utilisateur
       await Carte.update(
            { statut, nombre_max_entree, date_expiration, id_timezone },
            { where: { id_carte: carteAddedToUser.id_carte } }
        );
        const updatedCardData = await Carte.findOne({ where: { id_carte: carteAddedToUser.id_carte } });
        
        
        await publishCardDataToBroker(updatedCardData);
        
           
        // Calculer le nombre de cartes associées à l'utilisateur
        const nombreDeCartes = await calculer_nombre_carte(userId);

        // Mettre à jour le nombre de cartes associées à l'utilisateur dans la table User
        await User.update(
            { nombre_carte: nombreDeCartes },
            { where: { id_user: userId } }
        );

        return res.status(200).json({ message: 'Une autre carte a été associée à cet utilisateur' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Une erreur est survenue lors de l\'ajout de la carte' });
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const ReadOneuser = async (req, res, next) => {
    try {
        const userId = req.params.id_user;

       
        const user = await User.findOne({ where: { id_user: userId } });

        if (user) {
           
            return res.status(200).json({ user });
        } else {
           
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Updateuser = async (req, res, next) => {
    try {
        const userId = req.params.id_user; 
        const { nom, prenom, cin, alias, photo, email, telephone } = req.body;
        
        await User.update(
            {
                nom,
                prenom,
                cin,
                alias,
                email,
                telephone,
                photo,
            },
            {
                where: { id_user: userId },
                returning: true,
            }
        );
        return res.status(200).json({ message: 'User updated successfully' });
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


const ReadAlluser = async (req, res, next) => {
    try {
        
        const users = await User.findAll();

        
        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const DeleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id_user;

        // Find the user by primary key
        const user = await User.findByPk(userId);

        // If user not found, return 404
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user
        await user.destroy();

        // Update related Carte records asynchronously
        const updateCartesPromise = Carte.update({
            statue: 'active',
            nombre_max_entree: null,
            date_expiration: null,
            id_timezone: null
        }, {
            where: { id_user: userId }
        });

        // Wait for all async operations to complete
        await Promise.all([updateCartesPromise]);

        // Fetch updated card data
        const updatedCardData = await Carte.findOne({ where: { id_user: userId } });

        // Publish updated card data to the broker
        await publishCardDataToBroker(updatedCardData);

        // Return success response
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Get_user_card_id = async (req, res, next) => {
    try {
        const id_last_user = await User.max('id_user');

        if (id_last_user === null) {
            return res.status(500).json({ message: "Aucun utilisateur n'a été ajouté" });
        }

        const last_user_carte_id = await Carte.findOne({ where: { id_user: id_last_user } });

        if (!last_user_carte_id) {
            return res.status(500).json({ message: "Aucune carte n'est associée à cet utilisateur" });
        }

        const id_carte_last_user = last_user_carte_id['id_carte'];

        return res.status(200).json({ id_carte_last_user });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID de carte:', error);
        return res.status(500).json({ message: "Une erreur est survenue lors de la récupération de l'ID de carte" });
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



module.exports={
creer_user_avec_sa_carte,
Addothercartetouser,
ReadOneuser,
ReadAlluser,
DeleteUser,
Updateuser,
Get_user_card_id,
Update_user_carte
}