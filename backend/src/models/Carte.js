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
        type: DataTypes.ENUM('active', 'desactive', 'vip', 'blackliste'),
        allowNull: true,
        defaultValue: 'active',
    },
    nombre_max_entree: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    date_expiration: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    id_timezone: {
        type: DataTypes.INTEGER, 
        allowNull: true,
        references: {
            model: Timezone, 
            key: 'id_timezone' 
        }
    }
}, {
    timestamps: false // Désactive les timestamps
});

Carte.hasOne(Evenement, {
    foreignKey: 'id_carte'
});

module.exports = Carte;
