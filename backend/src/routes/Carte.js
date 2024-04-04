const { creer_carte_default, get_cartes_having_user } = require('../controllers/Carte')

const router = require('express').Router()
router.post('/carte',creer_carte_default)
router.get('/cartes',get_cartes_having_user)
module.exports=router