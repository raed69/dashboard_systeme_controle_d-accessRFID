import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import { Box, Snackbar, Alert } from '@mui/material';
import EditCarteForm from './EditCarteForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw', // Use viewport width to make it responsive
  maxWidth: '400px', // Ensure it doesn't get too wide on large screens
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // In case the content is too tall
};

function Badges() {
  const [data, setData] = useState([]);
  const [selectedCarteId, setSelectedCarteId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false); // State to manage deletion errors

  const toggleModal = (id_carte) => {
    setOpen(!open);
    setSelectedCarteId(id_carte);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/cartes');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData.cartesWithUsers || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setOpenError(true); // Open the error snackbar/notification
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id_carte) => {
    try {
      const response = await fetch(`http://localhost:5000/carte/delete/${id_carte}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete carte');
      }

      console.log('Carte deleted successfully');
      setData(data.filter(carte => carte.id_carte !== id_carte));
    } catch (error) {
      console.error('Error deleting carte:', error);
      setOpenError(true); // Open the error snackbar/notification
    }
  };

  // Close the Snackbar
  const handleCloseError = () => {
    setOpenError(false);
  };

  const columns = [
    { field: 'id_carte', headerName: 'ID', width: 80 },
    { field: 'numero', headerName: 'Numéro', width: 150 },
    { field: 'statut', headerName: 'Statut', width: 160 },
    { field: 'nombre_max_entree', headerName: 'Nombre maximal d\'entrées', width: 200 },
    { field: 'date_expiration', headerName: 'Date d\'expiration', width: 190 },
    { field: 'id_user', headerName: 'Propritaire', width: 180 }, // Corrected 'headeName' to 'headerName'
    {
      field: 'actions',
      headerName: '',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <IconButton 
              onClick={(e) => {
                e.stopPropagation(); // Prevents row selection
                toggleModal(params.row.id_carte);
              }} 
              sx={{ color: 'green' }}
            >
              <EditIcon />
            </IconButton>
            <IconButton 
              onClick={(e) => {
                e.stopPropagation(); // Prevents row selection
                handleDelete(params.row.id_carte);
              }} 
              sx={{ color: 'red' }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        open={open}
        onClose={() => toggleModal()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedCarteId && <EditCarteForm id_carte={selectedCarteId} />}
        </Box>
      </Modal>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          An error occurred!
        </Alert>
      </Snackbar>
      <div style={{ height: 400, width: '95%' }}>
        <div style={{ color: 'SkyBlue' }}>
          <h1>Liste des badges</h1>
        </div>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id_carte}
          checkboxSelection
          // @ts-ignore
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    </>
  );
}

export default Badges;
