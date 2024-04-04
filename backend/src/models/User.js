  const { DataTypes, Sequelize } = require('sequelize');
  const sequelize = require('../configDatabase/database');

  const Carte = require('./Carte');


  let User = sequelize.define('User', {
    id_user: {
      type:Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nom: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    prenom: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    alias: {
      type: Sequelize.STRING(6),
      allowNull: false,
      unique: true,
    },
    cin: {
      type: Sequelize.STRING(8),
     
      unique:true,
      valid:{
        len:{
          args:[8,8],
        }
      }
    },
    email: {
      type: Sequelize.STRING(255),
      
      
    },
    telephone: {
      type: Sequelize.STRING(8),
      allowNull: false,
    
    },
    photo: {
      type: Sequelize.BLOB('long'), 
    },
    nombre_carte: {
      type:DataTypes.INTEGER,
      defaultValue:1
    },
  
  });

  User.hasMany(Carte, {
    foreignKey: 'id_user', 
   
  });


  module.exports = User;
