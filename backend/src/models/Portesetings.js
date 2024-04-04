const { DataTypes } = require('sequelize')
const sequelize=require('../../src/configDatabase/database')

const Portesettings=sequelize.define('Portesettings',{
   
    door_lock_timeout:{
       type:DataTypes.INTEGER,
    },
    door_open_timeout:{
        type:DataTypes.INTEGER
    },
     
},
{timestamps:false})
module.exports=Portesettings