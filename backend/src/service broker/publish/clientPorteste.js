
const mqtt = require('mqtt');
const brokerUri = require("../brokerConfig");
const Portesettings = require('../../models/Portesetings');

// Create MQTT client instance
const client = mqtt.connect(brokerUri);
const publishPortesettingsToBroker = async (portesettingsdata) => {
    try {
        const dataToSend = {
            Portesettings:portesettingsdata,
            
        };;
        client.publish('topic/portesettings', JSON.stringify(dataToSend), (err) => {
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

module.exports = { publishPortesettingsToBroker };