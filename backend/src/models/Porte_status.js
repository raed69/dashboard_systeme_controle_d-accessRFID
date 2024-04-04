const { DataTypes } = require("sequelize");
const sequelize = require("../configDatabase/database");

const Porte_status=sequelize.define('Porte_status',{
    id_porte:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    type_porte:{
         type:DataTypes.ENUM('Ouvert','Fermee')
    }

})
module.exports=Porte_status