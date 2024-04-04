const Porte_status = require("../../models/Porte_status")

const initialisation_porte_status=async ()=>{
    try {
        const existiongportestatus=await Porte_status.count()
        if(existiongportestatus===0){
            const maxid_porte_status=await Porte_status.max('id_porte')
            if(maxid_porte_status <= 2){
                const porte_statusData=[
                    {type_porte : 'Ouvert'},
                    {type_porte:'Fermee'},
                ]
                await Porte_status.bulkCreate(porte_statusData)
            }
        }
    } catch (error) {
     console.error('Erreur lors de l\'initialisation des jours :', error)   
    }
}
module.exports={initialisation_porte_status}