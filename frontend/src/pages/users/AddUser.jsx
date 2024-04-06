import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  TextField,
  Button,
  Grid,
  Avatar,
  Typography,
  Box,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

function AddUserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null); // Ajout de l'état pour l'ID de l'utilisateur
  const watchedFields = watch();

  const [openSuccess, setOpenSuccess] = useState(false);
  const [openError, setOpenError] = useState(false);

  const handleClickSuccess = () => {
    setOpenSuccess(true);
  };

  const handleClickError = () => {
    setOpenError(true);
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccess(false);
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(URL.createObjectURL(event.target.files[0]));
    } else {
      setSelectedImage(null);
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const userData = await response.json();
        const newUserId = userData.id_user;
        setUserId(newUserId); // Mettre à jour l'ID de l'utilisateur
        localStorage.setItem("id_user", newUserId);
        handleClickSuccess();
        console.log("User created successfully with ID:", newUserId);
        window.location.href = "/userbadge";
      }
    } catch (error) {
      console.error("Error creating user:", error);
      handleClickError();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="user-form">
       <Grid container justifyContent="center" spacing={4}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            sx={{ color: "#87CEEB", fontWeight: "bold" }}
          >
            CREER USER
          </Typography>
          <Typography sx={{ fontWeight: "bold" }}>
            Creer Nouveau User
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <label htmlFor="photo">
            <Box display="flex" justifyContent="center" alignItems="center">
              <Avatar
                alt="User Photo"
                src={selectedImage}
                sx={{ width: 100, height: 100 }}
              >
                {!selectedImage && <PhotoCameraIcon />}{" "}
                {/* Utilisez une icône pour indiquer le chargement de la photo */}
              </Avatar>
            </Box>
            <input
              {...register("photo", { required: true })}
              id="photo"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </label>
          {errors.photo && (
            <Typography variant="body2" color="error">
              Ce champ est requis
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id="nom"
            label="Nom"
            variant="outlined"
            {...register("nom", { required: true, minLength: 3 })}
            error={Boolean(errors.nom)}
            helperText={
              Boolean(errors.nom)
                ? "this field is required & minimum 3 characteres"
                : null
            }
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id="prenom"
            label="Prénom"
            variant="outlined"
            {...register("prenom", { required: true, minLength: 3 })}
            error={Boolean(errors.prenom)}
            helperText={
              Boolean(errors.prenom)
                ? "this field is required & minimum 3 characteres"
                : null
            }
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
            helperText={
              Boolean(errors.cin)
                ? "Ce champ est requis et doit contenir uniquement des chiffres"
                : null
            }
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
            helperText={
              Boolean(errors.telephone)
                ? "Ce champ est requis et doit contenir uniquement des chiffres"
                : null
            }
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {watchedFields.countryCode}
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id="email"
            label="E-mail"
            variant="outlined"
            {...register("email", {
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            error={Boolean(errors.email)}
            helperText={
              Boolean(errors.email) ? "email n'est pas correct" : null
            }
            fullWidth
          />
        </Grid>

        <Grid sx={{ textAlign: "right" }} item xs={12}>
          <Button
            type="submit"
            disabled={submitting}
            variant="contained"
            color="primary"
          >
            Créer un utilisateur
          </Button>
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

          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={openError}
            autoHideDuration={1000}
            onClose={handleCloseError}
          >
            <Alert
              onClose={handleCloseError}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Stocke de carte est insufisant !
            </Alert>
          </Snackbar>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={openError}
            autoHideDuration={1000}
            onClose={handleCloseError}
          >
            <Alert
              onClose={handleCloseError}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              Cet User deja existe !
            </Alert>
          </Snackbar>
        </Grid>
      </Grid>
    </form>
  );
}

export default AddUserForm;
