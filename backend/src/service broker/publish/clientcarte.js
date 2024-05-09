// fichier où vous vous connectez au broker MQTT

const mqtt = require('mqtt');
const brokerUri = require("../brokerConfig");

// Create MQTT client instance
const client = mqtt.connect(brokerUri);

// Define the function to publish card data to the MQTT broker
const publishCardDataToBroker = async (carteData) => {
    try {
        const dataToSend = {
            carte: carteData,
            
        };;
        client.publish('topic/carte', JSON.stringify(dataToSend), (err) => {
            if (err) {
                console.error('Error publishing card data:', err);
            } else {
                console.log('Card data published successfully');
            }
        });
    } catch (error) {
        console.error('Error publishing card data:', error);
    }
};


module.exports = { publishCardDataToBroker };
