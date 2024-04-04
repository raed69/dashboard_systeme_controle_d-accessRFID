const Jours = require("../models/Jours")


const getAllJours = async (req, res, next) => {
    try {  
        const allJours = await Jours.findAll();
        res.status(200).json({ jours: allJours });
    } catch (error) {
        console.error('Erreur lors de la récupération des jours :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des jours.' });
    }
};
module.exports={getAllJours}