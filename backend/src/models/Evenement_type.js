const { DataTypes } = require('sequelize');
const sequelize = require('../configDatabase/database');
const Evenement = require('./Evenement');
const { Notification } = require('./notification');
const Porte_status = require('./Porte_status');
const Remarque = require('./Remarque');

const EvenementType = sequelize.define('EvenementType', {
    id_typeevent: {
        primaryKey: true,
        type: DataTypes.SMALLINT,
        autoIncrement:true
    },
}, {
    timestamps: false // Excluding timestamps
});

EvenementType.hasMany(Evenement, {
    foreignKey: 'id_typeevent',
    as: 'events'
});
Evenement.belongsTo(EvenementType, { foreignKey: 'id_typeevent' });

EvenementType.belongsTo(Notification, { foreignKey: 'id_notif' });
EvenementType.belongsTo(Porte_status, { foreignKey: 'id_porte' });
EvenementType.belongsTo(Remarque, { foreignKey: 'id_remarque' });

module.exports = EvenementType;
