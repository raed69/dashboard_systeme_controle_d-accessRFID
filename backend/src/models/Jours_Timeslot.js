const { DataTypes, Model } = require('sequelize');
const sequelize = require('../configDatabase/database');
const Jours = require('./Jours');
const Timeslot = require('./Timeslot');
const Timezone = require('./Timezone');

class Jours_Timeslot extends Model {}

Jours_Timeslot.init({
    id_jour_timeslot: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // Vous pouvez ajouter plus de colonnes ici si nécessaire
}, {
    sequelize,
    modelName: 'Jours_Timeslot',
    timestamps: false,
});

// Définissez l'association many-to-many entre Timeslot et Jours avec la table de jonction Jours_Timeslot
Jours_Timeslot.belongsTo(Jours, { foreignKey: 'JourIdJours' });
Jours_Timeslot.belongsTo(Timeslot, { foreignKey: 'TimeslotIdTimeslot' });

module.exports = Jours_Timeslot;
