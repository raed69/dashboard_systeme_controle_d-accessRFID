const { get_last_7_events } = require('../controllers/Evenement')

const router=require('express').Router()
router.get('/events',get_last_7_events)
module.exports=router