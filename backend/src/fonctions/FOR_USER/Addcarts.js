const User = require('../../models/User');
const Carte=require('../../models/Carte');

const Addcarte = async (userId) => {
    try {
        const userexiste = await User.findByPk(userId);
        console.log(userexiste);
        if (!userexiste) {
            console.log('Cette ID n\'existe pas dans notre base de données.');
            return;
        }

        const cartelibre = await Carte.findOne({ where: { id_user: null } });
        if (!cartelibre) {
            console.log('Carte store épuisé.');
            return;
        }

        userexiste.carte_numero += userexiste.carte_numero ? `    //   ${cartelibre.numero}` : `${cartelibre.numero}`;

        console.log(userexiste.carte_numero);

      
        await User.update(
            { carte_numero: userexiste.carte_numero },
            { where: { id_user: userId } }
        );

       
        await Carte.update(
            { id_user: userId },
            { where: { id_carte: cartelibre.id_carte } }
        );

        console.log('L\'utilisateur a ajouté une autre carte et la carte a été associée à cet utilisateur.');
    } catch (error) {
        console.log(error);
    }
};
module.exports=Addcarte