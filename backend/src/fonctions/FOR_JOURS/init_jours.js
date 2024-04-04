const Jours = require("../../models/Jours");

const initialisation_jours = async () => {
    try {
        const existjours = await Jours.count();
        if (existjours === 0) {
            const maxidjours = await Jours.max('id_jours');
            if (maxidjours <= 7) {
                const joursData = [
                    { nom_jours: 'Lundi' },
                    { nom_jours: 'Mardi' },
                    { nom_jours: 'Mercredi' },
                    { nom_jours: 'Jeudi' },
                    { nom_jours: 'Vendredi' },
                    { nom_jours: 'Samedi' },
                    { nom_jours: 'Dimanche' }
                ];
                await Jours.bulkCreate(joursData);
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des jours :', error);
    }
};
module.exports={initialisation_jours}