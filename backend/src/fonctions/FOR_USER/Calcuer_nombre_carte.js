const Carte = require("../../models/Carte");

const calculer_nombre_carte = async (userID) => {
    try {
        const carte_de_cet_user = await Carte.findAll({ where: { id_user: userID } });
        const nb = carte_de_cet_user.length;
        return nb;
    } catch (error) {
        console.error("Erreur lors du calcul du nombre de cartes :", error);
        return 0; // Retourne 0 en cas d'erreur
    }
};

module.exports = { calculer_nombre_carte };
