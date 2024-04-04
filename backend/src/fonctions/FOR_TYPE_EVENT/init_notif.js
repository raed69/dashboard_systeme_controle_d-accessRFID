const { Notification } = require("../../models/notification")

const Initialisation_notificiation=async()=>{
    try {
        const existuingnotif=await Notification.count()
        if(existuingnotif===0){
            const maxIdnotif=await Notification.max('id_notif')
            if(maxIdnotif<=4){
                const notifData=[ 
                   { type_notif:'Erreur'},
                    {type_notif:'Warning'},
                    {type_notif:'Information'},
                    {type_notif:'Danger'},
                    
                ]
                await Notification.bulkCreate(notifData)
            }
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des jours :', error)
    }
}
module.exports={Initialisation_notificiation}