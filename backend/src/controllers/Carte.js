const { Sequelize, Op, and } = require("sequelize")
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
            id_timezone:{[Op.not]: null}
        } });
        if (cartesWithUsers.length === 0) {
            return res.status(400).json({ message: "Désolé, aucune carte associée à un utilisateur !" });
        }
        return res.status(200).json({ cartesWithUsers });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: "Erreur lors de la récupération des données" });
    }
};




module.exports={
    creer_carte_default,
    get_cartes_having_user,
}