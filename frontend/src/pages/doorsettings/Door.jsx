import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function Door() {
  const [doorSettings, setDoorSettings] = useState({
    door_lock_timeout: '',
    door_open_timeout: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoorSettings({ ...doorSettings, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/portesettings', doorSettings);
      console.log('Door settings saved successfully');
    } catch (error) {
      console.error('Error saving door settings:', error);
    }
  };

  const isFormValid = () => {
    return doorSettings.door_lock_timeout.trim() !== '' && doorSettings.door_open_timeout.trim() !== '' && 
      parseInt(doorSettings.door_lock_timeout) > 0 && parseInt(doorSettings.door_open_timeout) > 0;
  };

  return (
    <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Paramètres de la porte
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          id="door_lock_timeout"
          name="door_lock_timeout"
          label="Délai de verrouillage de la porte"
          type="number"
          value={doorSettings.door_lock_timeout}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="door_open_timeout"
          name="door_open_timeout"
          label="Délai d'ouverture de la porte"
          type="number"
          value={doorSettings.door_open_timeout}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <Button 
          variant="contained" 
          color="primary" 
          type="submit"
          disabled={!isFormValid()} // Disable the button if the form is not valid
        >
          Enregistrer les paramètres
        </Button>
      </form>
    </Box>
  );
}

export default Door;
