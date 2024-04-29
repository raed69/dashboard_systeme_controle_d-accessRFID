const { DataTypes } = require('sequelize');
const sequelize = require('../configDatabase/database');


const Evenement = sequelize.define('Evenement', {
    id_event: {
        primaryKey: true,
        type: DataTypes.SMALLINT,
        autoIncrement: true,
    },
    flux: {
        type: DataTypes.ENUM('entrer', 'sortie')
    },
    access: {
        type: DataTypes.ENUM('sans carte', 'avec carte')
    },
    date_access: {
        type: DataTypes.DATE
    },
    carte_existnace: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Fixed typo in the default value property name
    }
});



module.exports = Evenement;
