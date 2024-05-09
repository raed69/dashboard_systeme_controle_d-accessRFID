
const mqtt = require('mqtt');
const brokerUri = require("../brokerConfig");

// Create MQTT client instance
const client = mqtt.connect(brokerUri);
const publishTimezoneDataToBroker = async (jourTimeslots) => {
    try {
        const dataToSend = {
            jourTimeslots: jourTimeslots
            
        };;
        client.publish('topic/timezone', JSON.stringify(dataToSend), (err) => {
            if (err) {
                console.error('Error publishing timezone data:', err);
            } else {
                console.log('timezone data published successfully');
            }
        });
    } catch (error) {
        console.error('Error publishing timezone data:', error);
    }
};

module.exports = { publishTimezoneDataToBroker };