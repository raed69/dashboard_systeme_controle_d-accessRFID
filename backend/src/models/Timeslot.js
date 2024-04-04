// Import des modules nécessaires
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../configDatabase/database');


// Définition du modèle Timeslot
class Timeslot extends Model {}

Timeslot.init({
    id_timeslot: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        start: 1
    },
    heure_entree: {
        type: DataTypes.TIME,
        allowNull: false
    },
    heure_sortie: {
        type: DataTypes.TIME,
        allowNull: false
    },
}, {
    sequelize,
    modelName: 'Timeslot'
});

// Définition de l'association many-to-many entre Timeslot et Jours


// Export du modèle Timeslot
module.exports = Timeslot;
