const EvenementType = require("../../models/Evenement_type");

const init_typ_event = async () => {
    try {
        // Check if there are already event types in the table
        const exist_type_event = await EvenementType.count();
        
        if (exist_type_event === 0) {
            // Define the data for initializing event types
            const type_event_data = [
                { id: 1, id_notif: 2, id_porte: 2, id_remarque: 1 },
                { id: 2, id_notif: 2, id_porte: 2, id_remarque: 2 },
                { id: 3, id_notif: 2, id_porte: 2, id_remarque: 3 },
                { id: 4, id_notif: 2, id_porte: 2, id_remarque: 4 },
                { id: 5, id_notif: 1, id_porte: 2, id_remarque: 5 },
                { id: 6, id_notif: 1, id_porte: 2, id_remarque: 6 },
                { id: 7, id_notif: 2, id_porte: 2, id_remarque: 7 },
                { id: 8, id_notif: 3, id_porte: 1, id_remarque: 8 },
                { id: 9, id_notif: 3, id_porte: 1, id_remarque: 9 },
                { id: 10, id_notif: 2, id_porte: 1, id_remarque: 10 },
                { id: 11, id_notif: 4, id_porte: 1, id_remarque: 11 },
                { id: 12, id_notif: 4, id_porte: 1, id_remarque: 12 },
            ];

            // Insert the initial event types into the database
            await EvenementType.bulkCreate(type_event_data);
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation des TYPE event:", error);
    }
};

module.exports = { init_typ_event };
