const { DataTypes, Model } = require('sequelize');
const sequelize = require('../configDatabase/database');


class Timezone extends Model {}

Timezone.init({
    id_timezone: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'Timezone'
});

module.exports = Timezone;
