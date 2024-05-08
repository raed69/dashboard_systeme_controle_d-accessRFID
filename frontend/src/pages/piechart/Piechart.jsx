import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';

// Couleurs pour le pie chart
const colors = ['#d2691e', '#dc143c', '#7fff00', 'cyan'];


function Piechart() {
    const [pieData, setPieData] = useState(null); // Stocke les données du pie chart
    const [isLoading, setIsLoading] = useState(true); // Indique si le chargement est en cours
    const [error, setError] = useState(null); // Stocke les erreurs éventuelles
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [warningRes, erreurRes, acceptedRes, dangerRes] = await Promise.all([
            fetch('http://localhost:5000/warning'),
            fetch('http://localhost:5000/erreur'),
            fetch('http://localhost:5000/accepted'),
            fetch('http://localhost:5000/danger'),
          ]);
  
          if (!warningRes.ok || !erreurRes.ok || !acceptedRes.ok || !dangerRes.ok) {
            throw new Error('Failed to fetch data from one or more endpoints');
          }
  
          const [warningData, erreurData, acceptedData, dangerData] = await Promise.all([
            warningRes.json(),
            erreurRes.json(),
            acceptedRes.json(),
            dangerRes.json(),
          ]);
  
          const newPieData = [
            { name: 'Warning', value: parseInt(warningData.percentage_warning_event, 10) },
            { name: 'Error', value: parseInt(erreurData.percentage_error_event, 10) },
            { name: 'Accepted', value: parseInt(acceptedData.percentage_accepted_event, 10) },
            { name: 'Danger', value: parseInt(dangerData.percentage_danger_event, 10) },
          ];
  
          setPieData(newPieData); // Met à jour les données du pie chart
          setIsLoading(false); // Le chargement est terminé
        } catch (error) {
          setError(error.message); // Gère les erreurs
          setIsLoading(false); // Le chargement est terminé
        }
      };
  
      fetchData(); // Appeler la fonction pour récupérer les données
    }, []); // Le hook useEffect s'exécute au montage du composant
  
    if (isLoading) {
      return (
        <Box height={400} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress /> {/* Indicateur de chargement */}
          <Typography>Chargement des données...</Typography>
        </Box>
      );
    }
  
    if (error) {
      return (
        <Box height={200} display="flex" justifyContent="center" alignItems="center">
          <Typography color="error">Erreur: {error}</Typography> {/* Affiche une erreur */}
        </Box>
      );
    }
  
  
  return (
    <Box  mt={9} height={400} display="flex" justifyContent="center" alignItems="center"> {/* Conteneur centré */}
      <PieChart width={500} height={450} > {/* Augmentation de la taille du graphique */}
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          innerRadius={70} // Agrandir le rayon intérieur pour un effet de donut plus grand
          outerRadius={200} 
          // @ts-ignore
          padAngle={5}// Agrandir le rayon extérieur
          label
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Legend verticalAlign="bottom" height={16}  wrapperStyle={{ paddingTop: 10 }}   />
        <Tooltip />
      </PieChart>
    </Box>
  );
};


export default Piechart