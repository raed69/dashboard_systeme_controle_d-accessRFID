const { Op, literal, fn, } = require("sequelize");
const Carte = require("../models/Carte");
const User = require("../models/User");


const show_carte_type = async (req, res, next) => {
    try {
        
        const cartesWithUsers = await Carte.findAll({
            where: {
                id_user: { [Op.not]: null },
                id_timezone: { [Op.not]: null } 
            }
        });

        
        if (cartesWithUsers.length === 0) {
            return res.status(400).json({ message: "Désolé, aucune carte associée à un utilisateur !" });
        }

        // Obtenir le nombre de chaque type de statut de carte
        const carteTypeCounts = await Carte.count({
            attributes: ['statut'], 
            group: ['statut'] 
        },{where:{id_user: { [Op.not]: null }}});

        res.status(200).json({ carteTypeCounts });
    } catch (error) {
        console.error('Erreur lors de la récupération :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};
//////////////////////////////////////// 
const show_dailyUser = async (req, res, next) => {
    try {
        // Obtenir le nombre d'utilisateurs ajoutés pour chaque jour de la semaine
        const dailyUserCount = await User.findAll({
            attributes: [
                [literal('DAYNAME(createdAt)'), 'day'], // Extraire le nom du jour de la semaine
                [fn('COUNT', 'id'), 'count'] // Compter le nombre d'utilisateurs pour chaque jour
            ],
            group: literal('DAYNAME(createdAt)'), // Regrouper par nom du jour de la semaine
        });

        res.status(200).json({ dailyUserCount });
    } catch (error) {
        console.error('Erreur lors de la récupération :', error);
        res.status(500).send('Erreur interne du serveur');
    }
}
//////////////////////////////////////////
const calculer_la_pourcentage_user_nouveau_parjours = async (req, res, next) => {
    try {
        
        const totalUsers = await User.count();

     
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

       
        const newUsersToday = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: today //bech ne5ou today
                }
            }
        });

        
        const percentageToday = ((newUsersToday / totalUsers) * 100).toFixed(0);

        res.status(200).json({ totalUsers, percentageToday});
    } catch (error) {
        console.error('Erreur lors du calcul du pourcentage de nouveaux utilisateurs par jour :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};
///////////////////////////////////////////////
const calculer_pourcentage_carte_blacklist_en_total = async (req, res, next) => {
    try {
        const totalCarte = await Carte.count();
        const cartesDesactivees = await Carte.findAll({
            where: {
                statut: 'desactive'
            }
        });
        const nbCartesDesactivees = cartesDesactivees.length; // Remove parentheses ()

        const percentageCartesDesactivees = ((nbCartesDesactivees / totalCarte) * 100).toFixed(0);

        res.status(200).json({ totalCarte, percentageCartesDesactivees });
    } catch (error) {
        console.error('Erreur lors du calcul du pourcentage de carte désactivée :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};



module.exports = { show_carte_type, show_dailyUser,calculer_la_pourcentage_user_nouveau_parjours ,calculer_pourcentage_carte_blacklist_en_total};
