
import React, { useEffect, useState } from 'react';
import { Button, CircularProgress, Grid, MenuItem, Select, Typography, Snackbar } from '@mui/material';
import TextField from '@mui/material/TextField';





function EditCarteForm({ id_carte }) {
    const [loading, setLoading] = useState(false); // Assume loading is false initially
    const [statut, setStatut] = useState('active');
    const [dateExpiration, setDateExpiration] = useState(null);
    const [nombreMaxEntree, setNombreMaxEntree] = useState('');
    const [timezoneOptions, setTimezoneOptions] = useState([]);
    const [timezone, setTimezone] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
  
    useEffect(() => {
        const fetchTimezones = async () => {
          try {
            const response = await fetch(`http://localhost:5000/timezones`);
            if (response.ok) {
              const data = await response.json();
              setTimezoneOptions(data.timezones);
              if (data.timezones.length > 0) {
                setTimezone(data.timezones[0].id_timezone);
              }
            } else {
              console.error('Failed to fetch timezones');
            }
          } catch (error) {
            console.error('Error fetching timezones:', error);
          }
        };
         fetchTimezones();     
      }, []);
      const handleStatutChange = (event) => {
        setStatut(event.target.value);
      };
      
      const handleTimezoneChange = (event) => {
          setTimezone(event.target.value);
        };
        
      
        
        const handleSubmit = async () => {
            try {
                const response = await fetch(`http://localhost:5000/carte/update/${id_carte}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
              statut: statut,
              nombre_max_entree: nombreMaxEntree,
              date_expiration: dateExpiration ? dateExpiration.toISOString() : null,
              id_timezone: timezone
            })
          });
    
          if (response.ok) {
            console.log('Data saved successfully!');
            setSnackbarOpen(true);
            setTimeout(() => {
              window.location.href="/carte";
            }, 2000);
          } else {
            console.error('Failed to save data');
          }
        } catch (error) {
          console.error('Error while saving data:', error);
        }
      };
      
    
      const maximumDate = new Date("YYYY-MM-DD");
      function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
      
      if (loading) {
        return <CircularProgress />;
      }
     
      return (
        <div>
          <Grid container justifyContent="center" alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6"> Info Carte</Typography>
              <TextField 
                label="ID de la carte"
                variant="outlined"
                fullWidth
                value={id_carte}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2, mt:2 }}
              />
              <Select
                label="Statut de la carte"
                variant="outlined"
                fullWidth
                value={statut}
                onChange={handleStatutChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value="active">Actif</MenuItem>
                <MenuItem value="desactive">Désactivé</MenuItem>
                <MenuItem value="vip">VIP</MenuItem>
                <MenuItem value="blacklist">Liste noire</MenuItem>
              </Select>
              
              <TextField
                label="Date d'expiration"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={
                  dateExpiration
                    ? formatDate(dateExpiration)
                    : ""
                }
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  setDateExpiration(selectedDate);
                }}
                inputProps={{
                  min: formatDate(new Date()),
                  max: formatDate(maximumDate),
                }}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Nombre maximal d'entrées"
                variant="outlined"
                fullWidth
                value={nombreMaxEntree}
                onChange={(e) => setNombreMaxEntree(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Select
                label="Time Zone"
                variant="outlined"
                fullWidth
                value={timezone}
                onChange={handleTimezoneChange}
                sx={{ mb: 2 }}
              >
                {timezoneOptions.map((option) => (
                  <MenuItem key={option.id_timezone} value={option.id_timezone}>
                    {option.nom}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
               Updater
              </Button>
            </Grid>
          </Grid>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            message="Enregistrement réussi!"
          />
        </div>
      );
    }




 

export default EditCarteForm