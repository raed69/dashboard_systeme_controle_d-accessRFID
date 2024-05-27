const { creer_carte_default, get_cartes_having_user, update_carte, DeleteCarte, get_Vision_of_carte } = require('../controllers/Carte')

const router = require('express').Router()
router.post('/carte',creer_carte_default)
router.get('/cartes',get_cartes_having_user)
router.get('/carte/visualizecarte/:id_carte',get_Vision_of_carte)
router.patch('/carte/update/:id_carte',update_carte)
router.delete('/carte/delete/:id_carte',DeleteCarte)
module.exports=router