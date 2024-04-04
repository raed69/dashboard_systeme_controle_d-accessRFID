const { Create_door_settings, Edit_door_settings } = require('../controllers/Portesettings')

const router=require('express').Router()

router.post('/portesettings',Create_door_settings)
router.patch('/portesettings/:id',Edit_door_settings)
module.exports=router