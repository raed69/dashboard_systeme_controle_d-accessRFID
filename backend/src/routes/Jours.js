const { getAllJours } = require('../controllers/Jours')

const router = require('express').Router()
router.get('/jours',getAllJours)
module.exports=router