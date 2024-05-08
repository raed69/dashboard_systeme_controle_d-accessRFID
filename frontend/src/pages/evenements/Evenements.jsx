import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Typography, useTheme, useMediaQuery } from '@mui/material';

function Evenements() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.events) {
          const formattedEvents = data.events.map((event) => ({
            id: event.id_event, // Identifiant unique
            access: event.access,
            flux: event.flux,
            date_access: event.ate_access, // Assurez-vous que c'est valide
            propritaire: event.propritaire,
            type_notif: event.type_notif,
          }));

          setEvents(formattedEvents);
          setLoading(false); // Arrêter le chargement
        } else {
          throw new Error('Unexpected data structure'); // Gérer les données inattendues
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.message);
        setLoading(false); // Arrêter le chargement en cas d'erreur
      }
    };

    fetchData();
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const gridHeight = isMobile ? 300 : 400;

  // Fonction pour déterminer la couleur en fonction du type de notification
  const getColorByType = (type) => {
    switch (type.toLowerCase()) {
      case 'erreur':
        return '#dc143c';
      case 'warning':
        return '#d2691e';
      case 'accepted':
        return '#7fff00';
      case 'danger':
        return 'cyan';
      default:
        return '#7fff00';
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.5 },
    { field: 'flux', headerName: 'Flux', flex: 1 },
    { field: 'access', headerName: 'Access', flex: 1 },
    { field: 'date_access', headerName: 'Date Access', flex: 1 },
    { field: 'propritaire', headerName: 'Propriétaire', flex: 1 },
    {
      field: 'type_notif',
      headerName: 'Type de Notification',
      flex: 1,
      // Appliquer du style en fonction du type de notification
      renderCell: (params) => (
        <Typography style={{ color: getColorByType(params.value) }}>
          {params.value}
        </Typography>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ height: gridHeight, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading Events...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: gridHeight, textAlign: 'center' }}>
        <Typography color="error">{`Error: ${error}`}</Typography>
      </div>
    );
  }

  return (
    <div style={{ height: gridHeight, width: '100%' }}>
      <DataGrid
        rows={events}
        columns={columns}
        getRowId={(row) => row.id} // Utilisation de l'identifiant unique
        pageSize={5}
        autoPageSize
        checkboxSelection={false}
      />
    </div>
  );
}

export default Evenements;
