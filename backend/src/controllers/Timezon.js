const Timezone = require('../models/Timezone');
const Jours = require('../models/Jours');
const Timeslot = require('../models/Timeslot');
const Jours_Timeslot = require('../models/Jours_Timeslot');
const sequelize = require('../configDatabase/database');
const Timezone_Jours_Timeslot = require('../models/Timezone_jours_timeslot');
const { Op } = require('sequelize');

const creer_timezone = async (req, res) => {
  try {
      const timezoneData = req.body;

      // Validate timezoneData
      if (!Array.isArray(timezoneData) || timezoneData.length === 0) {
          throw new Error('Invalid or empty timezone data');
      }

      const timezoneName = timezoneData[0].nom;

      if (!timezoneName) {
          throw new Error('Timezone name is missing in the first element.');
      }

      // Create or find the timezone using the name from the first element
      let [timezone] = await Timezone.findOrCreate({
          where: { nom: timezoneName }
      });

      // Iterate through the timeslots of each timezone configuration
      for (const timezoneConfig of timezoneData) {
          for (const timeSlot of timezoneConfig.timeslot) { // Changed from `times` to `timeslot`
              // Find or create timeslot
              let [createdTimeslot] = await Timeslot.findOrCreate({
                  where: { heure_entree: timeSlot.heure_entree, heure_sortie: timeSlot.heure_sortie }
              });

              // Add associations with jour to the JourTimeslot model
              for (const day of timezoneConfig.jours) { // Changed from `days` to `jours`
                  const jour = Object.keys(day)[0];
                  if (day[jour]) {
                      const jourObject = await Jours.findOne({ where: { nom_jours: jour } });
                      if (jourObject && createdTimeslot) {
                          let [jourTimeslot] = await Jours_Timeslot.findOrCreate({
                              where: {
                                  JourIdJours: jourObject.id_jours,
                                  TimeslotIdTimeslot: createdTimeslot.id_timeslot,
                              }
                          });

                          // Create entry in TimezoneJourTimeslot if JourTimeslot exists
                          if (jourTimeslot) {
                              await Timezone_Jours_Timeslot.findOrCreate({
                                  where: {
                                    id_jour_timeslot: jourTimeslot.id_jour_timeslot,
                                    id_timezone: timezone.id_timezone,   
                                  }
                              });
                          }
                      }
                  }
              }
          }
      }

      console.log('Timezone data registered successfully.');
      res.status(201).json({ message: 'Timezone data registered successfully.' });
  } catch (error) {
      console.error('Error registering timezone data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
};







////////////////////
const recuperer_timezones = async (req, res, next) => {
    try {
      const timezones = await Timezone.findAll();
      return res.status(200).json({ timezones });
    } catch (error) {
      console.log('Erreur lors de la récupération des timezones :', error);
      return res.status(500).json({ message: 'Erreur lors de la récupération des timezones.' });
    }
  };
///////////////////

const recuperer_details_timezone = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Vérifier si la timezone existe
    const timezone = await Timezone.findOne({ where: { id_timezone: id } });
    if (!timezone) {
      return res.status(404).json({ message: "Timezone non trouvée." });
    }

    // Trouver les enregistrements dans la table de jonction Timezone_Jours_Timeslot qui correspondent à cette timezone
    const jourTimeslots = await Timezone_Jours_Timeslot.findAll({
      where: { id_timezone: id },
      include: [
        {
          model: Jours_Timeslot,
          include: [
            {
              model: Jours,
              attributes: ['nom_jours'] // Exclure l'ID de Jours
            },
            {
              model: Timeslot,
              attributes: ['heure_entree', 'heure_sortie'] // Exclure l'ID de Timeslot
            }
          ],
          attributes: ['JourIdJours'] // Exclure l'ID de jourTimeslot
        }
      ],
      attributes: [] // Exclure tous les attributs de Timezone_Jours_Timeslot
    });

    if (!jourTimeslots.length) {
      return res.status(404).json({ message: "Aucun détail trouvé pour cette timezone." });
    }

    // Répondre avec les détails structurés par jour
    res.json({ id: id, timezone_details: jourTimeslots });
  } catch (error) {
    console.error('Erreur lors de la récupération des détails de la timezone :', error);
    res.status(500).send('Erreur interne du serveur');
  }
};












//////////////////
const mettre_a_jour_timezone = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nom } = req.body;
      const timezoneToUpdate = await Timezone.findByPk(id);
      if (!timezoneToUpdate) {
        return res.status(404).json({ message: 'Timezone non trouvée.' });
      }
      await timezoneToUpdate.update({ nom });
      return res.status(200).json({ message: 'Timezone mise à jour avec succès.', timezone: timezoneToUpdate });
    } catch (error) {
      console.log('Erreur lors de la mise à jour de la timezone :', error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de la timezone.' });
    }
  };
///////////////////
const supprimer_timezone = async (req, res, next) => {
    try {
      const { id } = req.params;
      const timezoneToDelete = await Timezone.findByPk(id);
      if (!timezoneToDelete) {
        return res.status(404).json({ message: 'Timezone non trouvée.' });
      }
      await timezoneToDelete.destroy();
      return res.status(200).json({ message: 'Timezone supprimée avec succès.' });
    } catch (error) {
      console.log('Erreur lors de la suppression de la timezone :', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression de la timezone.' });
    }
  };

module.exports = { 
    creer_timezone ,
    recuperer_timezones,
    mettre_a_jour_timezone,
    supprimer_timezone,
    recuperer_details_timezone
};
