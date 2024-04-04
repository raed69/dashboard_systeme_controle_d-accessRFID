const { DataTypes } = require("sequelize");
const sequelize = require("../configDatabase/database");

const Remarque=sequelize.define('Remarque',{
    id_remarque:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    message:{
        type:DataTypes.STRING
    }
})
module.exports=Remarque