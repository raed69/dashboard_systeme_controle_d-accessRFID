const {  show_carte_type, show_dailyUser, calculer_la_pourcentage_user_nouveau_parjours, calculer_pourcentage_carte_blacklist_en_total } = require('../controllers/Status')

const router=require('express').Router()
router.get('/stats',show_carte_type)
router.get('/dailyuser',show_dailyUser)
router.get('/userparjour',calculer_la_pourcentage_user_nouveau_parjours)
router.get('/cartedesa',calculer_pourcentage_carte_blacklist_en_total)

module.exports=router