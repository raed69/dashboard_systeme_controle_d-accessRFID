const express = require('express');
const { creer_timezone, recuperer_timezones, mettre_a_jour_timezone, supprimer_timezone, recuperer_details_timezone } = require('../controllers/Timezon');
const router = express.Router();

router.post('/timezone/creer',creer_timezone)
router.get('/timezones',recuperer_timezones)
router.get('/timezone/:id',recuperer_details_timezone)
router.put('/timezone/:id',mettre_a_jour_timezone)
router.delete('/timezone/:id',supprimer_timezone)
module.exports=router