const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./src/configDatabase/database'); 
const mqtt =require('mqtt')
const cors =require('cors')
const usermodel=require('./src/models/User') ;
const cartemodel=require('./src/models/Carte')
const Timezonemodel=require('./src/models/Timezone')
const Joursmodel=require('./src/models/Jours')
const Timeslotmodel=require('./src/models/Timeslot')
const Jours_Timeslot=require('./src/models/Jours_Timeslot')
const timezone_jours_timeslot=require('./src/models/Timezone_jours_timeslot')
const Evenement=require('./src/models/Evenement')
const Evenementtype=require('./src/models/Evenement_type')
const Portesettings=require('./src/models/Portesetings')
const userrouter=require('./src/routes/User')
const carterouter=require('./src/routes/Carte')
const timezonerouter=require('./src/routes/Timezone')
const joursrouter=require('./src/routes/Jours')
const portesettingsrouter=require('./src/routes/Portesettings')

const { initialisation_jours } = require('./src/fonctions/FOR_JOURS/init_jours');
const { Initialisation_notificiation } = require('./src/fonctions/FOR_TYPE_EVENT/init_notif');
const { initialisation_porte_status } = require('./src/fonctions/FOR_TYPE_EVENT/init_porte_status');
const { initialisation_remarque } = require('./src/fonctions/FOR_TYPE_EVENT/init_remarque');
const { insertInitialCards } = require('./src/fonctions/FOR_Carte/produire200badges');
const brokerUri = require('./src/service broker/brokerConfig');





const app = express();
app.use(bodyParser.json());
app.use(cors())
///API USER ////
app.post('/user',userrouter)
app.patch('/user/:id_user/addcarte',userrouter)
app.patch('/user/:id_user', userrouter);
app.get('/users',userrouter);
app.get('/user/:id_user',userrouter);
app.delete('/user/:id_user',userrouter);
app.get('/lastuser/carte',userrouter)
app.patch('/lastuser/carte',userrouter)

 


///API CARTE ///////
app.post('/carte',carterouter)
app.get('/cartes',carterouter)
app.patch('/carte/update/:id_carte',carterouter)
app.delete('/carte/delete/:id_carte',carterouter)
////API TIMEZONE////
app.post('/timezone/creer',timezonerouter)
app.get('/timezones',timezonerouter)
app.get('/timezone/:id',timezonerouter)
app.put('/timezone/:id',timezonerouter)
app.delete('/timezone/:id',timezonerouter)

////API JOURS ////////
app.get('/jours',joursrouter)


////API DOOR SETINGS///
app.post('/portesettings',portesettingsrouter)
app.patch('/portesettings/:id',portesettingsrouter)







////connecter au broker
const client = mqtt.connect(brokerUri);


// Sync the database and start the server
sequelize.sync()   
  .then(() => {
    console.log('Database and tables created!');
    
    // Continue with starting the server
    app.listen(5000, () => {
      console.log('Server is running on port 5000!');
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
insertInitialCards()
initialisation_jours()
Initialisation_notificiation()
initialisation_porte_status()
initialisation_remarque()