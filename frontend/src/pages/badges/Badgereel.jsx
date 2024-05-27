import React, { useEffect, useState } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

function Badgereel({ id_carte }) {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/carte/visualizecarte/${id_carte}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setCardData(jsonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id_carte]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!cardData) {
    return <Typography>Error loading card data</Typography>;
  }

  const buffer = new Uint8Array(cardData.photo.data);
  const base64String = btoa(String.fromCharCode(...buffer));
  const imageSrc = `data:image/png;base64,${base64String}`;
console.log(imageSrc)
  return (
    <Box
      sx={{
        width: 300,
        height: 400,
        padding: 2,
        border: '1px solid black',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 3,
        backgroundColor: 'black',
      }}
    >
      <Box
        component="img"
        sx={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
        src={imageSrc}
        
      />
        <Typography variant="h6"> {cardData.propritaire}</Typography>
      <Typography variant="body1" align="left" gutterBottom>
        {cardData.numero}
      </Typography>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body1">ID: {cardData.id_carte}</Typography>
        <Typography variant="body1">Statut: {cardData.statut}</Typography>
        <Typography variant="body1">Max Entrée: {cardData.nombre_max_entree}</Typography>
        <Typography variant="body1">Expiration: {cardData.date_expiration}</Typography>
      </Box>
    </Box>
  );
}

export default Badgereel;
