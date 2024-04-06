import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import AddCardIcon from '@mui/icons-material/AddCard';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import { Box } from '@mui/material';
import EditUserForm from './EditUser';
import AddOtherCartetouser from './AddOtherCartetouser';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 10,
};

function User() {
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddCartModal, setOpenAddCartModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then(res => res.json())
      .then(data => setData(data.users))
      .catch(err => console.log(err));
  }, []);

  const toggleModal = (id_user, type) => {
    setSelectedUserId(id_user);
    if (type === 'edit') {
      setOpenEditModal(!openEditModal);
    } else if (type === 'addCart') {
      setOpenAddCartModal(!openAddCartModal);
    }
  };

  const handleEdit = (id_user) => {
    toggleModal(id_user, 'edit');
  };

  const handleAddcart = async (id_user) => {
    toggleModal(id_user, 'addCart');
  };

  const handleDelete = async (id_user) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const response = await fetch(`http://localhost:5000/user/${id_user}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        console.log('User deleted successfully');
        window.location.reload();
        setData(data.filter(user => user.id_user !== id_user));

      } catch (error) {
        console.error('Error deleting user:', error);
        // Afficher un message d'erreur en cas d'échec de la suppression
        setOpenError(true);
      }
    }
  };

  const columns = [
    { field: 'id_user', headerName: 'ID', width: 60 },
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'prenom', headerName: 'Prénom', width: 150 },
    { field: 'cin', headerName: 'CIN', width: 120 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'telephone', headerName: 'Téléphone', width: 120 },
    { field: 'nombre_carte', headerName: 'nombreCarte', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 190,

      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <IconButton onClick={(e) => { e.stopPropagation(), handleEdit(params.row.id_user)}} sx={{ color: 'green' }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={(e) => {e.stopPropagation(),handleAddcart(params.row.id_user)} }sx={{ color: 'yellow' }}>
              <AddCardIcon />
            </IconButton>
            <IconButton onClick={(e) => {e.stopPropagation(),handleDelete(params.row.id_user)}} sx={{ color: 'red' }}>
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
        open={openEditModal}
        onClose={() => toggleModal(null, 'edit')}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedUserId && <EditUserForm id_user={selectedUserId} />}
        </Box>
      </Modal>
      <Modal
        open={openAddCartModal}
        onClose={() => toggleModal(null, 'addCart')}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {selectedUserId && <AddOtherCartetouser id_user={selectedUserId} />}
        </Box>
      </Modal>
      <div style={{ height: 400, width: '95%' }}>
        <div style={{ color: 'SkyBlue' }}>
          <h1>Liste des utilisateurs</h1>
        </div>
        <DataGrid
          rows={data}
          columns={columns}
          getRowId={(row) => row.id_user}
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

export default User;
function setOpenError(arg0) {
  throw new Error('Function not implemented.');
}

