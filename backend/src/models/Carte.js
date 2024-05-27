const { DataTypes } = require('sequelize');
const sequelize = require('../configDatabase/database');
const User = require('./User');
const Evenement = require('./Evenement');
const Timezone = require('./Timezone');

const Carte = sequelize.define('Carte', {
    id_carte: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,   
    },
    statut: {
        type: DataTypes.ENUM('active', 'desactive', 'vip', 'blacklisté'),
        allowNull: true,
        defaultValue: 'active',
    },
    nombre_max_entree: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    date_expiration: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    id_timezone: {
        type: DataTypes.INTEGER, 
        allowNull: true,
        references: {
            model: Timezone, 
            key: 'id_timezone' 
        }
    },
    propritaire:{
        type:DataTypes.STRING,
        allowNull:true
    }
}, {
    timestamps: false // Désactive les timestamps
});

Carte.hasMany(Evenement, { foreignKey: 'id_carte' }); // Carte a de nombreux événements
Evenement.belongsTo(Carte, { foreignKey: 'id_carte' });

module.exports = Carte;
