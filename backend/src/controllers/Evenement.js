const { Op } = require("sequelize");
const { format } = require('date-fns');
const Evenement = require("../models/Evenement");
const Carte = require("../models/Carte");
const EvenementType = require("../models/Evenement_type");

const Notification = require("../models/notification").Notification;

const get_last_7_events = async (req, res) => {
  try {
    const nb_total_event = await Evenement.count();
    const start_event_nb = nb_total_event > 7 ? nb_total_event - 7 : 0;

    const recentEvents = await Evenement.findAll({
      where: {
        id_event: { [Op.gt]: start_event_nb },
      },
      attributes: ["id_event", "access", "flux", "date_access"], // Champs à extraire des événements
      include: [
        {
          model: Carte, // Inclure Carte pour obtenir le propriétaire
          attributes: ["propritaire"],
        },
        {
          model: EvenementType, // Inclure EvenementType pour obtenir la notification
          attributes: ["id_typeevent"],
          include: [
            {
              model: Notification, // Inclure Notification pour obtenir le type de notification
              attributes: ["type_notif"],
            },
          ],
        },
      ],
      order: [["id_event", "DESC"]], // Ordre par id_event croissant
    });

    // Formater les événements pour inclure le propriétaire de la carte et le type de notification
    const formattedEvents = recentEvents.map((event) => ({
      id_event: event.id_event,
      access: event.access,
      flux: event.flux,
      ate_access: format(new Date(event.date_access), 'yyyy-MM-dd HH:mm'),
      propritaire: event.Carte.propritaire, // Propriétaire associé à l'ID de la carte
      type_notif: event.EvenementType.Notification.type_notif, // Type de notification
    }));

    res.status(200).json({ events: formattedEvents });
  } catch (error) {
    console.error("Error fetching the last 7 events:", error);
    res.status(500).json({ error: "An error occurred while retrieving the events." });
  }
};

module.exports = { get_last_7_events };
