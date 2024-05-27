import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import { Box, Snackbar, Alert, Typography, useMediaQuery, Grid } from '@mui/material';
import EditCarteForm from './EditCarteForm';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Badgereel from './Badgereel';



 

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '150%',
  maxWidth: '400px',
  bgcolor: 'background.paper',
  border: '4px solid #000',
  boxShadow: 24,
  p: 5,
  overflowY: 'auto',
};

function Badges() {
  const [data, setData] = useState([]);
  const [selectedCarteId, setSelectedCarteId] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const toggleEditModal = (id_carte) => {
    setOpenEditModal(!openEditModal);
    setSelectedCarteId(id_carte);
  };

  const toggleViewModal = (id_carte) => {
    setOpenViewModal(!openViewModal);
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
      setOpenError(true);
    }
  };

  const handleCloseError = () => {
    setOpenError(false);
  };

  const columns = [
    { field: 'id_carte', headerName: 'ID', width: 80 },
    { field: 'numero', headerName: 'Numéro', width: 150 },
    { field: 'statut', headerName: 'Statut', width: 160 },
    { field: 'nombre_max_entree', headerName: 'Nombre maximal d\'entrées', width: 200 },
    { field: 'date_expiration', headerName: 'Date d\'expiration', width: 160 },
    { field: 'propritaire', headerName: 'Propriétaire', width: 180 },
    {
      field: 'actions',
      headerName: '',
      width: isSmallScreen ? 100 : 150,
      sortable: false,
      renderCell: (params) => (
        <div>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleEditModal(params.row.id_carte);
            }}
            sx={{ color: 'green' }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row.id_carte);
            }}
            sx={{ color: 'red' }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              toggleViewModal(params.row.id_carte);
            }}
            sx={{ color: 'yellow' }}
          >
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <Modal
        open={openEditModal}
        onClose={() => toggleEditModal(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedCarteId && <EditCarteForm id_carte={selectedCarteId} />}
        </Box>
      </Modal>
      <Modal
        open={openViewModal}
        onClose={() => toggleViewModal(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedCarteId && <Badgereel id_carte={selectedCarteId} />}
        </Box>
      </Modal>
      <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          An error occurred!
        </Alert>
      </Snackbar>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10}>
          <Box sx={{ height: 400, width: '100%' }}>
            <Typography variant="h4" style={{ color: 'SkyBlue', marginBottom: '16px' }}>Liste des badges</Typography>
            <DataGrid
              rows={data}
              columns={columns}
              getRowId={(row) => row.id_carte}
              checkboxSelection
              pageSize={pageSize}
              
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Badges;
