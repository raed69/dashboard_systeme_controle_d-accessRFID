const { creer_user_avec_sa_carte, Addothercartetouser, Updateuser, ReadAlluser,  Update_user_carte, ReadOneuser, DeleteUser, Get_user_card_id } = require('../controllers/User')

const router=require('express').Router()

router.post('/user',creer_user_avec_sa_carte)
router.patch('/user/:id_user/addcarte',Addothercartetouser)
router.patch('/user/:id_user',Updateuser)
router.get('/user/:id_user',ReadOneuser)
router.get('/users',ReadAlluser),
router.get('/lastuser/carte',Get_user_card_id)
router.patch('/lastuser/carte',Update_user_carte)
router.delete('/user/:id_user',DeleteUser)

module.exports=router