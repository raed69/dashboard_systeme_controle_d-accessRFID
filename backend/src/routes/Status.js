const {  show_carte_type, show_dailyUser, calculer_la_pourcentage_user_nouveau_parjours, calculer_pourcentage_carte_blacklist_en_total, show_daily_Events, show_daily_accepted_events, percentage_warning_events, percentage_error_events, percentage_accepted_event, percentage_danger_events } = require('../controllers/Status')

const router=require('express').Router()
router.get('/dailyacceptedevents',show_daily_accepted_events)
router.get('/dailyevent',show_daily_Events)
router.get('/stats',show_carte_type)
router.get('/dailyuser',show_dailyUser)
router.get('/userparjour',calculer_la_pourcentage_user_nouveau_parjours)
router.get('/cartedesa',calculer_pourcentage_carte_blacklist_en_total)
router.get('/warning',percentage_warning_events)
router.get('/erreur',percentage_error_events)
router.get('/accepted',percentage_accepted_event)
router.get('/danger',percentage_danger_events)

module.exports=router