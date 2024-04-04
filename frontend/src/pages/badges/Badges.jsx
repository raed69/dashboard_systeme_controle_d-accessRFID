import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Badges() {
  const [data, setData] = useState([]);

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

  const handleEdit = (id) => {
    console.log('Edit', id);
    // Implement edit logic here
  };

  const handleDelete = (id) => {
    console.log('Delete', id);
    // Implement delete logic here
  };

  const columns = [
    { field: 'id_carte', headerName: 'ID', width: 80 },
    { field: 'numero', headerName: 'Numéro', width: 150 },
    { field: 'statut', headerName: 'Statut', width: 160 },
    { field: 'nombre_max_entree', headerName: 'Nombre maximal d\'entrées', width: 200 },
    { field: 'date_expiration', headerName: 'Date d\'expiration', width: 190 },
    {field:'id_user',headeName:'Owner',width:80},
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <div>
            <IconButton onClick={() => handleEdit(params.row.id_carte)} sx={{ color: 'green' }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.row.id_carte)} sx={{ color: 'red' }}>
              <DeleteIcon />
            </IconButton>
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ height: 400, width: '95%' }}>
      <div style={{ color: 'SkyBlue' }}>
        <h1>Liste des cartes</h1>
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
  );
}

export default Badges;
