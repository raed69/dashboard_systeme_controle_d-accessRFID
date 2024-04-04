import {
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Typography,
  Snackbar,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

function AddCarteToUser() {
  const [idCarte, setIdCarte] = useState("");
  const [loading, setLoading] = useState(true);
  const [statut, setStatut] = useState();
  const [dateExpiration, setDateExpiration] = useState(null);
  const [nombreMaxEntree, setNombreMaxEntree] = useState();
  const [timezoneOptions, setTimezoneOptions] = useState([]);
  const [timezone, setTimezone] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchUserCarte = async () => {
      const userId = localStorage.getItem("id_user");
      

      if (!userId) {
        console.error("No user ID found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/timezones`);
        if (response.ok) {
          const data = await response.json();
          setTimezoneOptions(data.timezones );
        } else {
          console.error("Failed to fetch timezones");
        }
      } catch (error) {
        console.error("Error fetching timezones:", error);
      }
    };

    fetchUserCarte();
  }, []);

  useEffect(() => {
    const fetchUserCarte = async () => {
      const userId = localStorage.getItem("id_user");
      if (!userId) {
        console.error("No user ID found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/lastuser/carte`);
        if (response.ok) {
          const data = await response.json();
          setIdCarte(data.id_carte);
          setStatut(data.statut || "active");
          setDateExpiration(data.date_expiration || null); // Initialize as null
          setNombreMaxEntree(data.nombre_max_entree || "");
          setTimezone(data.id_timezone || "");
        } else {
          console.error("Failed to fetch user carte");
        }
      } catch (error) {
        console.error("Error fetching user carte:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCarte();
  }, []);

  const handleStatutChange = (event) => {
    setStatut(event.target.value);
  };

  const handleTimezoneChange = (event) => {
    setTimezone(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/lastuser/carte", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          statut: statut,
          nombre_max_entree: nombreMaxEntree,
          date_expiration: dateExpiration ? dateExpiration.toISOString() : null, // Convert to ISO string if not null
          id_timezone: timezone,
        }),
      });

      if (response.ok) {
        console.log("Data saved successfully!");
        setSnackbarOpen(true);
        setTimeout(() => {
          window.location.href = "/carte";
        }, 2000)
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error("Error while saving data:", error);
    }
  };

  useEffect(() => {
    return () => {
      setIdCarte("");
    };
  }, []);

  const maximumDate = new Date("YYYY-MM-DD");
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div>
      <Grid container justifyContent="center" alignItems="center" spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4"> la Carte de l'Utilisateur</Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <TextField
                label="ID de la carte"
                variant="outlined"
                fullWidth
                value={idCarte}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ mb: 2, mt: 2 }}
              />
              <Select
                label="Statut de la carte"
                variant="outlined"
                fullWidth
                value={statut}
                defaultValue="Actif" // Définissez la valeur par défaut sur "active"
                onChange={handleStatutChange}
                sx={{ mb: 2 }}
                aria-label="Statut de la carte" // Ajoutez un attribut aria-label pour une meilleure accessibilité
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
                    ? formatDate(dateExpiration) // Utilisez la fonction formatDate pour afficher la date dans le bon format
                    : ""
                }
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  setDateExpiration(selectedDate);
                }}
                inputProps={{
                  min: formatDate(new Date()), // Limitez la date minimale à la date d'aujourd'hui
                  max: formatDate(maximumDate), // Remplacez maximumDate par la date maximale autorisée
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Nombre maximal d'entrées"
                variant="outlined"
                fullWidth
                value={nombreMaxEntree}
                onChange={(e) => {
                  const input = e.target.value;
                  // Vérifie si l'entrée est vide ou si elle contient un chiffre et a au maximum 5 chiffres
                  if (input === "" || /^\d{1,5}$/.test(input)) {
                    // @ts-ignore
                    setNombreMaxEntree(input);
                  }
                }}
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
                {/* Première valeur pour "Choisir un fuseau horaire" */}
                <MenuItem value="Choisir un fuseau horaire">
                  
                </MenuItem>
                {/* Mappez les options de fuseau horaire */}
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
                Associer
              </Button>
            </>
          )}
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

export default AddCarteToUser;
