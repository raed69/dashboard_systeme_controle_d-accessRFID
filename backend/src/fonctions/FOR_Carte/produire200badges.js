const fs = require('fs');
const path = require('path');

const Carte = require('../../models/Carte');
const { Numero_carte_genere } = require('./numerogenere');

const flagFilePath = path.join(__dirname, 'initialCardsInserted.flag');

async function insertInitialCards() {
    try {
        // Vérifier si le drapeau existe
        if (fs.existsSync(flagFilePath)) {
            console.log('Les cartes initiales ont déjà été insérées. Ignorer...');
            return;
        }
        // Générer et insérer 200 cartes
        const cardsToInsert = [];
        for (let i = 0; i < 200; i++) {
            const cardNumber = Numero_carte_genere();
            cardsToInsert.push({ numero: cardNumber });
        }
        await Carte.bulkCreate(cardsToInsert);

        console.log('Insertion de 200 cartes réussie');

        // Écrire le drapeau dans le fichier
        fs.writeFileSync(flagFilePath, '');

    } catch (error) {
        console.error('Erreur lors de l\'insertion des cartes :', error);
    }
}

module.exports = { insertInitialCards };
