import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  TextField, Button, Grid, Avatar, Box, Snackbar, Alert
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

function EditUserForm({ id_user }) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };
  const handleClickSuccess = () => {
    setOpenSuccess(true);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id_user) return;
      try {
        const response = await fetch(`http://localhost:5000/user/${id_user}`);
        if (!response.ok) {
          throw new Error('Could not fetch user data');
        }
        const userData = await response.json();
        setUserData(userData);
        setValue('nom', userData.nom);
        setValue('prenom', userData.prenom);
        setValue('cin', userData.cin);
        setValue('telephone', userData.telephone);
        setValue('email', userData.email);
        if (userData.photo) {
          setSelectedImage(userData.photo);
        }
        console.log(userData)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchUserData();
  }, [id_user, setValue]);
  

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
      setValue('photo', file);
    } else {
      setSelectedImage(null);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const userDataToUpdate = {
        nom: data.nom,
        prenom: data.prenom,
        cin: data.cin,
        telephone: data.telephone,
        email: data.email,
        // Ajoutez d'autres champs si nécessaire
      };
  
      const response = await fetch(`http://localhost:5000/user/${id_user}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataToUpdate),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
  
      console.log('User updated successfully');
       handleClickSuccess();
       window.location.reload();

    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="user-form">
     
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <label htmlFor="photo">
            <Box display="flex" justifyContent="center" alignItems="center">
              <Avatar
                alt="User Photo"
                src={selectedImage}
                sx={{ width: 100, height: 100 }}
              >
                {!selectedImage && <PhotoCameraIcon />}
              </Avatar>
            </Box>
            <input
              {...register("photo")}
              id="photo"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </label>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="nom"
            label="Nom"
            variant="outlined"
            {...register("nom", { minLength: 3 })}
            error={Boolean(errors.nom)}
            helperText={errors.nom && "Ce champ est requis & minimum 3 caractères"}
            defaultValue={userData?.nom ?? ''}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id="prenom"
            label="Prénom"
            variant="outlined"
            {...register("prenom", { minLength: 3 })}
            error={Boolean(errors.prenom)}
            helperText={errors.prenom && "Ce champ est requis & minimum 3 caractères"}
            defaultValue={userData ?.prenom ?? '' }
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="cin"
            label="CIN"
            variant="outlined"
            {...register("cin", { pattern: /^\d{8}$/ })}
            error={Boolean(errors.cin)}
            helperText={errors.cin && "Ce champ est requis et doit contenir uniquement des chiffres"}
            defaultValue={userData ?.cin ?? ''}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="telephone"
            label="Téléphone"
            variant="outlined"
            {...register("telephone", { pattern: /^\d{8}$/ })}
            error={Boolean(errors.telephone)}
            helperText={errors.telephone && "Ce champ est requis et doit contenir uniquement des chiffres"}
            defaultValue={userData ?.telephone ?? '' }
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="email"
            label="E-mail"
            variant="outlined"
            {...register("email", { pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })}
            error={Boolean(errors.email)}
            helperText={errors.email && "Email non valide"}
            defaultValue={userData ?.email ?? ''}
            fullWidth
          />
        </Grid>
        <Grid sx={{ textAlign: "right" }} item xs={12}>
        <Button type="submit" disabled={submitting} variant="contained" color="primary">
          Sauvegarder les modifications
        </Button>
        </Grid>
        
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={openSuccess}
            autoHideDuration={2000}
            onClose={handleCloseSuccess}
          >
            <Alert
              onClose={handleCloseSuccess}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Utilisateur enregistré avec succès
            </Alert>
          </Snackbar>
      </Grid>
    </form>
  );
}

export default EditUserForm;
