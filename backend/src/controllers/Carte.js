const { Sequelize, Op, and, where } = require("sequelize")
const { Numero_carte_genere } = require("../fonctions/FOR_Carte/numerogenere")
const Carte = require("../models/Carte")
const User = require("../models/User")

const creer_carte_default=async(req,res,next)=>{
    try {
        const num_carte=Numero_carte_genere()
        await Carte.create({
            numero:num_carte
        })
        return res.status(200).json({message:'default carte est cree avec succes !'})
    } catch (error) {
        console.log(error)
        return res.status(400).json({error:'error de la creation'})
    }
}

const get_cartes_having_user = async (req, res, next) => {
    try {
        const cartesWithUsers = await Carte.findAll({ where: { 
            id_user: { [Op.not]: null },              
        }, 
        order: [['id_carte', 'DESC']],
    });
        
        if (cartesWithUsers.length === 0) {
            return res.status(400).json({ message: "Désolé, aucune carte associée à un utilisateur !" });
        }
        return res.status(200).json({ cartesWithUsers });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Erreur lors de la récupération des données" });
    }
};

const update_carte = async (req,res,next)=>{
    try {
        const { statut,nombre_max_entree,date_expiration,id_timezone} = req.body;
        const carteId=req.params.id_carte
         await Carte.update({
            statut,
            nombre_max_entree,
            date_expiration,
            id_timezone  
         },{where:{id_carte:carteId}})
         return res.status(200).json({ message: "Les informations de la carte  ont été mises à jour avec succès" });
    
        
    } catch (error) {
        console.error('Error updating  carte:', error);
        return res.status(500).json({ message: "Une erreur s'est produite lors de la mise à jour des informations de la carte" });
    }
}

const DeleteCarte = async (req, res, next) => {
    try {
        const carteId = req.params.id_carte;

       
        const carte = await Carte.findByPk(carteId);

        
        if (!carte) {
            return res.status(404).json({ error: 'Carte not found' });
        }

        const id_User_selectedcarte = carte.id_user;
        const proprietaires = await Carte.findAll({ where: { id_user: id_User_selectedcarte } });

        
        if (proprietaires.length === 1) {
            return res.status(400).json({ error: 'This user has only one carte; it cannot be deleted.' });
        } else {
         
            await carte.destroy();

           
            const user = await User.findOne({ where: { id_user: id_User_selectedcarte } });
            if (user) {
                await User.update({ nombre_carte: user.nombre_carte - 1 }, { where: { id_user: id_User_selectedcarte } });
            }

            // Return success response
            return res.status(200).json({ message: 'Carte deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting carte:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
const get_Vision_of_carte = async (req, res) => {
    try {
        const carteId = req.params.id_carte;

        // Retrieve the card information
        const carteExistance = await Carte.findOne({ where: { id_carte: carteId } });
        if (!carteExistance) {
            return res.status(404).json({ message: "Cette carte n'existe pas Dejà !!" });
        }

        // Retrieve the user associated with the card
        const userDeCetteCarte = await User.findOne({ where: { id_user: carteExistance.id_user } });
        if (!userDeCetteCarte) {
            return res.status(404).json({ message: "Utilisateur associé à cette carte introuvable !!" });
        }

        // Get the user's photo
        const photoUser = userDeCetteCarte.photo;

        // Create the response object, excluding the id_user
        const carteResponse = {
            id_carte: carteExistance.id_carte,
            numero: carteExistance.numero,
            statut: carteExistance.statut,
            nombre_max_entree: carteExistance.nombre_max_entree,
            date_expiration: carteExistance.date_expiration,
            id_timezone: carteExistance.id_timezone,
            propritaire: carteExistance.propritaire,
            photo: photoUser
        };

        // Respond with the card data and user photo
        return res.status(200).json(carteResponse);
    } catch (error) {
        console.error('Error displaying the card:', error);
        return res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des données !" });
    }
};



module.exports={
    creer_carte_default,
    get_cartes_having_user,
    update_carte,
    DeleteCarte,
    get_Vision_of_carte
}     