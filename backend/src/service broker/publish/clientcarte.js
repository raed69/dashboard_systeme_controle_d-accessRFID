// fichier où vous vous connectez au broker MQTT

const mqtt = require('mqtt');
const brokerUri = require("../brokerConfig");

// Create MQTT client instance
const client = mqtt.connect(brokerUri);

const publishCardDataToBroker = async (carteData,jourTimeslots) => {
    try {
        client.on('connect', () => {
            console.log('Connexion au broker MQTT établie');
            const dataToSend = {
                carte: carteData,
                jourTimeslots: jourTimeslots
            };
            client.publish('topic/carte', JSON.stringify(dataToSend), (err) => {
                if (err) {
                    console.error('Erreur lors de la publication des données de la carte :', err);
                } else {
                    console.log('Données de la carte publiées avec succès');
                    client.end(); // Fermeture de la connexion MQTT
                }
            });
        });

        client.on('error', (err) => {
            console.error('Erreur de connexion au broker MQTT :', err);
        });
    } catch (error) {
        console.error('Erreur lors de la publication des données de la carte vers le broker MQTT:', error);
    }
};


module.exports = { publishCardDataToBroker };
