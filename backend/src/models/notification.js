const { DataTypes } = require('sequelize')
const sequelize=require('../configDatabase/database')
const Notification=sequelize.define('Notification',{
    id_notif:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    type_notif:{
        type:DataTypes.ENUM('Erreur','Warning','Information','Danger')
    }
})
module.exports={Notification}