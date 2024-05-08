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

function CustomPagination({ page, setPage, pageSize, setPageSize }) {
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(0);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      <IconButton onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={() => handlePageChange(page + 1)}>
        <KeyboardArrowRight />
      </IconButton>
      <span style={{ marginLeft: '8px', marginRight: '8px' }}>Page: {page + 1}</span>
      <span style={{ marginLeft: '8px', marginRight: '8px' }}>Taille de page:</span>
      <select value={pageSize} onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={20}>20</option>
      </select>
    </div>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '1000vw', 
  maxWidth: '400px', 
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', 
};

function Badges() {
  const [data, setData] = useState([]);
  const [selectedCarteId, setSelectedCarteId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false); 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); 
  const isSmallScreen = useMediaQuery('(max-width:600px)');

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
    { 
      field: 'date_expiration', 
      headerName: 'Date d\'expiration', 
      width: 160,
    },
    { field: 'propritaire', headerName: 'Propritaire', width: 180 },
    {
      field: 'actions',
      headerName: '',
      width: isSmallScreen ? 100 : 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <IconButton 
              onClick={(e) => {
                e.stopPropagation(); 
                toggleModal(params.row.id_carte);
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
      <Grid container justifyContent="center">
        <Grid item xs={12} md={10}>
          <Box sx={{ height: 400, width: '100%' }}>
            <div style={{ color: 'SkyBlue' }}>
              <h1>Liste des badges</h1>
            </div>
            
            <DataGrid
              rows={data}
              columns={columns}
              getRowId={(row) => row.id_carte}
              checkboxSelection
              // @ts-ignore
              pageSize={pageSize}
              components={{ Toolbar: () => <GridToolbar><CustomPagination page={page} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} /></GridToolbar> }}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Badges;
