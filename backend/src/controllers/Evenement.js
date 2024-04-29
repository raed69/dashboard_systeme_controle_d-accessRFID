const { Op } = require("sequelize");
const Evenement = require("../models/Evenement");

const get_last_7_events = async (req, res, next) => {
    try {
        const nb_total_event = await Evenement.count();

        if (nb_total_event <= 7) {
            const all_events = await Evenement.findAll();
            res.status(200).json({ message: { all_events } });
        } else {
            const start_event_nb = nb_total_event - 7;
            const recentsevents = await Evenement.findAll({
                where: {
                    id_event: { [Op.gt]: start_event_nb }
                },
                order: [['id_event', 'ASC']], // Ensures the order of returned events
            });
            res.status(200).json({ message: { recentsevents } });
        }
    } catch (error) {
        console.error('Error fetching the last 7 events:', error);
        res.status(500).json({ error: "An error occurred while retrieving the events." });
    }
};

module.exports = { get_last_7_events };
