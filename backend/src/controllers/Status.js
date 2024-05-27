const { Op, literal, fn, where, } = require("sequelize");
const Carte = require("../models/Carte");
const User = require("../models/User");
const Evenement = require("../models/Evenement");
const { findAll } = require("../models/Timezone");


const show_carte_type = async (req, res, next) => {
    try {
        
        const cartesWithUsers = await Carte.findAll({
            where: {
                id_user: { [Op.not]: null },
                id_timezone: { [Op.not]: null } 
            }
        });

        
        if (cartesWithUsers.length === 0) {
            return res.status(400).json({ message: "Désolé, aucune carte associée à un utilisateur !" });
        }

        // Obtenir le nombre de chaque type de statut de carte
        const carteTypeCounts = await Carte.count({
            attributes: ['statut'], 
            group: ['statut'] 
        },{where:{id_user: { [Op.not]: null }}});

        res.status(200).json({ carteTypeCounts });
    } catch (error) {
        console.error('Erreur lors de la récupération :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};
//////////////////////////////////////// 
const show_dailyUser = async (req, res, next) => {
    try {
        // Obtenir le nombre d'utilisateurs ajoutés pour chaque jour de la semaine
        const dailyUserCount = await User.findAll({
            attributes: [
                [literal('DAYNAME(createdAt)'), 'day'], // Extraire le nom du jour de la semaine
                [fn('COUNT', 'id'), 'count'] // Compter le nombre d'utilisateurs pour chaque jour
            ],
            group: literal('DAYNAME(createdAt)'), // Regrouper par nom du jour de la semaine
        });

        res.status(200).json({ dailyUserCount });
    } catch (error) {
        console.error('Erreur lors de la récupération :', error);
        res.status(500).send('Erreur interne du serveur');
    }
}
//////////////////////////////////////////
const calculer_la_pourcentage_user_nouveau_parjours = async (req, res, next) => {
    try {
        
        const totalUsers = await User.count();

     
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

       
        const newUsersToday = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: today //bech ne5ou today
                }
            }
        });

        
        const percentageToday = ((newUsersToday / totalUsers) * 100).toFixed(0);

        res.status(200).json({ totalUsers, percentageToday});
    } catch (error) {
        console.error('Erreur lors du calcul du pourcentage de nouveaux utilisateurs par jour :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};
///////////////////////////////////////////////
const calculer_pourcentage_carte_blacklist_en_total = async (req, res, next) => {
    try {
        const totalCarte = await Carte.count();
        const cartesDesactivees = await Carte.findAll({
            where: {
                statut: 'desactive'
            }
        });
        const nbCartesDesactivees = cartesDesactivees.length; // Remove parentheses ()

        const percentageCartesDesactivees = ((nbCartesDesactivees / totalCarte) * 100).toFixed(0);

        res.status(200).json({ totalCarte, percentageCartesDesactivees });
    } catch (error) {
        console.error('Erreur lors du calcul du pourcentage de carte désactivée :', error);
        res.status(500).send('Erreur interne du serveur');
    }
};
////////////////////////////////////
const show_daily_Events=async(req,res)=>{
    try {
        
        const totalevents = await Evenement.count();

     
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

       
        const neweventsToday = await Evenement.count({
            where: {
                createdAt: {
                    [Op.gte]: today //bech ne5ou today
                }
            }
        });

        
        const percentageToday = ((neweventsToday / totalevents) * 100).toFixed(0);

        res.status(200).json({ totalevents, percentageToday});
    } catch (error) {
        console.error('Erreur lors du calcul du pourcentage de nouveaux events par jour :', error);
        res.status(500).send('Erreur interne du serveur');
    }
}
////////////////////////////////////////////
const show_daily_accepted_events = async (req, res) => {
    try {
      // Fetch all accepted events with id_typeevent of 8 or 9
      const nb_total_event_accepted = await Evenement.count({
        where: { id_typeevent: { [Op.or]: [8, 9] } },
      });
  
      // Calculate start of today (midnight)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      // Fetch the count of accepted events created today
      const accepted_event_today = await Evenement.count({
        where: {
          id_typeevent: { [Op.or]: [8, 9] },
          createdAt: { [Op.gte]: today },
        },
      });
  
      // Calculate percentage
      const percentageToday = nb_total_event_accepted
        ? ((accepted_event_today / nb_total_event_accepted) * 100).toFixed(0)
        : 0;
  
      // Return the results
      res.status(200).json({ nb_total_event_accepted, percentageToday });
    } catch (error) {
      console.error(
        'Error while calculating the percentage of daily accepted events:',
        error
      );
      res.status(500).send('Internal server error');
    }
  };
  ///////////////////////////////////////////////////////
  const percentage_accepted_event=async(req,res)=>{
    try {
        const nb_total_event=await Evenement.count()
        const nb_total_event_accepted = await Evenement.count({
            where: { id_typeevent: { [Op.or]: [8, 9] } },
          });
          const percentage_accepted_event=((nb_total_event_accepted/nb_total_event)*100).toFixed(0)
          res.status(200).json({ nb_total_event,percentage_accepted_event });
    } catch (error) {
        console.error(
            'Error while calculating the percentage accepted events:',
            error
          );
          res.status(500).send('Internal server error');
    }
  }
  ///////////////////////////////////////////////////////
  const percentage_error_events=async(req,res)=>{
    try {
        const nb_total_event=await Evenement.count()
        const nb_total_event_error = await Evenement.count({
            where: { id_typeevent: { [Op.or]: [5,6 ] } },
          });
          const percentage_error_event=((nb_total_event_error/nb_total_event)*100).toFixed(0)
          res.status(200).json({ nb_total_event,percentage_error_event });
    } catch (error) {
        console.error(
            'Error while calculating the percentage error events:',
            error
          );
          res.status(500).send('Internal server error');
    }
  }
  /////////////////////////////////////////////////////////////
  const percentage_warning_events=async(req,res)=>{
    try {
        const nb_total_event=await Evenement.count()
        const nb_total_event_warning = await Evenement.count({
            where: { id_typeevent: { [Op.or]: [1,2,3,4,7,10 ] } },
          });
          const percentage_warning_event=((nb_total_event_warning/nb_total_event)*100).toFixed(0)
          res.status(200).json({ nb_total_event,percentage_warning_event });
    } catch (error) {
        console.error(
            'Error while calculating the percentage Warning events:',
            error
          );
          res.status(500).send('Internal server error');
    }
  }
  ///////////////////////////////////////////////////////////////////
  const percentage_danger_events=async(req,res)=>{
    try {
        const nb_total_event=await Evenement.count()
        const nb_total_event_danger = await Evenement.count({
            where: { id_typeevent: { [Op.or]: [11,12] } },
          });
          const percentage_danger_event=((nb_total_event_danger/nb_total_event)*100).toFixed(0)
          res.status(200).json({ nb_total_event,percentage_danger_event });
    } catch (error) {
        console.error(
            'Error while calculating the percentage Danger events:',
            error
          );
          res.status(500).send('Internal server error');
    }
  }
  /////////////////////////////////////////////////////
  

module.exports = {percentage_accepted_event,percentage_error_events,percentage_warning_events, percentage_danger_events,show_daily_accepted_events,show_daily_Events,show_carte_type, show_dailyUser,calculer_la_pourcentage_user_nouveau_parjours ,calculer_pourcentage_carte_blacklist_en_total};
