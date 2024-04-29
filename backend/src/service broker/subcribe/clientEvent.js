const mqtt = require("mqtt");
const brokerUri = require("../brokerConfig");
const Evenement = require("../../models/Evenement");
const Carte = require("../../models/Carte");

// Create MQTT client instance
const client = mqtt.connect(brokerUri);

const SubscribeEventDatafrombroker = async () => {
  try {
    client.on("connect", () => {
      console.log("Connection to MQTT broker established");

      // Subscribe to the specified topic
      client.subscribe("topic/evenement", (err, granted) => {
        // corrected
        if (err) {
          console.error("Error subscribing to event data:", err);
        } else {
          console.log("Successfully subscribed to event data:", granted);
        }
      });
    });

    // Handle incoming messages on the subscribed topic
    client.on("message", async (topic, message) => {
      if (topic === "topic/evenement") {
        try {
          // Convert the message from a Buffer to a JSON object
          const eventData = JSON.parse(message.toString());
          console.log("Received event data:", eventData);

          await Evenement.create({
            flux: eventData.flux,
            access: eventData.access,
            date_access: eventData.date_access,
            carte_existnace: eventData.carte_existnace,
            id_carte: eventData.id_carte,
            id_typeevent:eventData.id_typeevent
          });
          const this_new_comming_carte_existe = await Carte.findOne({
            where: { id_carte: eventData.id_carte },
          });

          if (!this_new_comming_carte_existe) {
            await Carte.create({
              id_carte: eventData.id_carte,
            });
            console.log("Nouvelle carte enregistrée dans la base de données");
          }

          console.log("Event data saved successfully.");
        } catch (dbError) {
          console.error("Database error when saving event data:", dbError);
        }
      }
    });

    client.on("error", (err) => {
      console.error("Connection error with MQTT broker:", err);
    });
  } catch (error) {
    console.error("Error subscribing to event data from MQTT broker:", error);
  }
};

module.exports = { SubscribeEventDatafrombroker };
