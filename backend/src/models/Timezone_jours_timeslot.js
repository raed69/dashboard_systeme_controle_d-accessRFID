const { Model, DataTypes } = require('sequelize');
const sequelize = require('../configDatabase/database'); // Votre connexion Sequelize
const Timezone = require('./Timezone');
const Jours_Timeslot = require('./Jours_Timeslot');
const Jours = require('./Jours');
const Timeslot = require('./Timeslot');

class Timezone_Jours_Timeslot extends Model {}

Timezone_Jours_Timeslot.init({
  id_timezone: {
    type: DataTypes.INTEGER,
    references: {
      model: Timezone, // Assurez-vous que cela correspond à votre modèle Timezone
      key: 'id_timezone',
    },
    allowNull: true
  },
  id_jour_timeslot: {
    type: DataTypes.INTEGER,
    references: {
      model: Jours_Timeslot, // Ceci doit correspondre au nom de votre table de jonction Jours-Timeslot
      key: 'id_jour_timeslot',
    },
    allowNull:true
  }
}, {
  sequelize,
  modelName: 'Timezone_Jours_Timeslot',
  timestamps:false,
});

Timezone_Jours_Timeslot.belongsTo(Timezone, { foreignKey: 'id_timezone' });

// Association entre Jour et Timezone_Jours_Timeslot
Timezone_Jours_Timeslot.belongsTo(Jours_Timeslot, { foreignKey: 'id_jour_timeslot'});


// Association entre Timeslot et Timezone_Jours_Timeslot
Timezone_Jours_Timeslot.belongsTo(Timeslot, { foreignKey: 'id_jour_timeslot', as: 'Timeslot' });
Timeslot.hasMany(Timezone_Jours_Timeslot, { foreignKey: 'id_jour_timeslot', as: 'Timeslot' });
module.exports = Timezone_Jours_Timeslot;
