const { DataTypes, Model } = require('sequelize');
const sequelize = require('../configDatabase/database');




class Jours extends Model {}

Jours.init({
    id_jours: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom_jours: {
        type: DataTypes.ENUM('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'),
        allowNull: false // Ajout de allowNull pour rendre obligatoire le nom du jour
    }
}, {
    sequelize,
    modelName: 'Jours',
    timestamps: false // Si vous ne voulez pas de champs de timestamp (createdAt, updatedAt)
});

module.exports = Jours;
