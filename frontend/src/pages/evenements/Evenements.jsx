import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme, useMediaQuery } from '@mui/material';

function Evenements() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/events') // Adjust with your endpoint
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching events:', error);
        setLoading(false);
      });
  }, []);

  // Check for responsive breakpoints
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Considered 'small' for mobile
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md')); // For tablet sizes

  const columns = [
    { field: 'id_event', headerName: 'ID_event', flex: 1 }, // Using 'flex' to allow adaptive width
    { field: 'flux', headerName: 'Flux', flex: 1 },
    { field: 'access', headerName: 'Access', flex: 1 },
    { field: 'date_access', headerName: 'Date Access', flex: 2 }, // More space for date
    { field: 'carte_existnace', headerName: 'Card Exists', flex: 1, type: 'boolean' },
  ];

  // Modify grid size based on screen size
  const gridHeight = isMobile ? 300 : 400; // Smaller height for mobile

  return (
    <div style={{ height: gridHeight, width: '100%', padding: isMobile ? '10px' : '20px' }}>
      <DataGrid
        rows={events}
        // @ts-ignore
        columns={columns}
        pageSize={isMobile ? 5 : 7} // Fewer rows per page on mobile
        loading={loading}
        autoPageSize={isMobile} // Automatic page size for mobile
        density={isMobile ? 'compact' : 'standard'} // Compact density for mobile
      />
    </div>
  );
}

export default Evenements;
