const EvenementType = require("../../models/Evenement_type");

const init_typ_event = async () => {
    try {
        // Check if there are already event types in the table
        const exist_type_event = await EvenementType.count();
        
        if (exist_type_event == 0) {
            const maxidtypeevent= await EvenementType.max('id_typeevent');
            if (maxidtypeevent <= 12) {
            const type_event_data = [
                { id_typeevent: 1, id_notif: 2, id_porte: 2, id_remarque: 1 },
                { id_typeevent: 2, id_notif: 2, id_porte: 2, id_remarque: 2 },
                { id_typeevent: 3, id_notif: 2, id_porte: 2, id_remarque: 3 },
                { id_typeevent: 4, id_notif: 2, id_porte: 2, id_remarque: 4 },
                { id_typeevent: 5, id_notif: 1, id_porte: 2, id_remarque: 5 },
                { id_typeevent : 6, id_notif: 1, id_porte: 2, id_remarque: 6 },
                { id_typeevent: 7, id_notif: 2, id_porte: 2, id_remarque: 7 },
                { id_typeevent: 8, id_notif: 3, id_porte: 1, id_remarque: 8 },
                { id_typeevent : 9, id_notif: 3, id_porte: 1, id_remarque: 9 },
                { id_typeevent: 10, id_notif: 2, id_porte: 1, id_remarque: 10 },
                { id_typeevent: 11, id_notif: 4, id_porte: 1, id_remarque: 11 },
                { id_typeevent: 12, id_notif: 4, id_porte: 1, id_remarque: 12 },
            ];

            // Insert the initial event types into the database
            await EvenementType.bulkCreate(type_event_data);
        }
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation des TYPE event:", error);
    }
};

module.exports = { init_typ_event };
