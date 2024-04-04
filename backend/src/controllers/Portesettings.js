const Portesettings = require("../models/Portesetings")

const Create_door_settings= async(req,res,next)=>{
    try {
     const {door_lock_timeout,door_open_timeout}=req.body
  const newPorteparams =  await Portesettings.create({
        door_lock_timeout,
        door_open_timeout
     })   
   res.status(200).json({newPorteparams})        
    } catch (error) {
        console.log(error)
      res.status(400).json({message:"error"})  
    }
}


const Edit_door_settings=async(req,res,next)=>{
    try {
        const {id}=req.params
        const existingid=await Portesettings.findOne({where:{id:id}})
        if(!existingid){
            res.status(400).json({message:"Cette id n'existe pas"})
        }
        await Portesettings.update({
            door_lock_timeout,
            door_open_timeout
        })
        res.status(200).json({message:"Porte Settings a ete modifier !"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"error"})
    }
}
module.exports={
    Create_door_settings,
    Edit_door_settings,
}