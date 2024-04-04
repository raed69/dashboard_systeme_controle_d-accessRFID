const Remarque = require("../../models/Remarque")

const initialisation_remarque=async ()=>{
    try {
        const existremarque=await Remarque.count()
        if(existremarque===0){
            const rmarqueData = [
                {message:'Carte non trouvée '},
                {message:'Carte en liste noire'},
                {message:'Carte désactivée'},
                {message:'Zone horaire non autorisée'},
                {message:'Puce expirée'},
                {message:'Porte restée ouverte'},
                {message:'Porte forcée ouverte"'},
                {message:'Problème avec la porte de sortie'},
                {message:'Problème avec la porte d`entrée'},      
                {message:'Accès normal par carte'},
                {message:'Accès normal par bouton de sortie'},

            ]
            await Remarque.bulkCreate(rmarqueData)
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des jours :', error)
    }
}
module.exports={initialisation_remarque}