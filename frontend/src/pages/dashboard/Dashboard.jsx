import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Grid,
  useTheme,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import StatBox from "pages/stattbox/StatBox";
import BlockIcon from "@mui/icons-material/Block";
import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import Timeline from "pages/timelinechart/Timeline";
import Bar from "pages/barchart/Bar";

function Dashboard() {
  const theme = useTheme();
  const [newClientsData, setNewClientsData] = useState(null);
  const [disabledCardsData, setDisabledCardsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, cardResponse] = await Promise.all([
          fetch("http://localhost:5000/userparjour"),
          fetch("http://localhost:5000/cartedesa"),
        ]);

        if (!userResponse.ok || !cardResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [userData, cardData] = await Promise.all([
          userResponse.json(),
          cardResponse.json(),
        ]);

        setNewClientsData(userData);
        setDisabledCardsData(cardData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box m="18px">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          Dashboard
        </Typography>
      
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadOutlinedIcon />}
          sx={{ fontWeight: "bold" }}
        >
          Download Reports
        </Button>
      </Box>

      <Grid container spacing={5}>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            bgcolor={theme.palette.grey[900]}
            p={2}
            borderRadius={10}
            textAlign="center"
            display="flex"
            justifyContent="center"
            sx={{
              transition: "background-color 0.3s",
              "&:hover": { bgcolor: theme.palette.grey[800] },
            }}
          >
            <StatBox
              title="0"
              subtitle={
                <Typography
                  variant="h5"
                  sx={{ color: "skyblue", fontWeight: "bold" }}
                >
                  Evenements
                </Typography>
              }
              progress={0.75}
              increase="+0%"
              icon={<EventIcon />}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box
            bgcolor={theme.palette.grey[900]}
            p={2}
            borderRadius={10}
            textAlign="center"
            display="flex"
            justifyContent="center"
            sx={{
              transition: "background-color 0.3s",
              "&:hover": { bgcolor: theme.palette.grey[800] },
            }}
          >
            <StatBox
              title="0"
              subtitle={
                <Typography
                  variant="h5"
                  sx={{ color: "skyblue", fontWeight: "bold" }}
                >
                  Acces
                </Typography>
              }
              progress={0.5}
              increase="+0%"
              icon={<EventAvailableIcon />}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {!isLoading && newClientsData ? (
            <Box
              bgcolor={theme.palette.grey[900]}
              p={2}
              borderRadius={10}
              textAlign="center"
              display="flex"
              justifyContent="center"
              sx={{
                transition: "background-color 0.3s",
                "&:hover": { bgcolor: theme.palette.grey[800] },
              }}
            >
              <StatBox
                title={Math.floor(newClientsData.totalUsers).toString()}
                subtitle={
                  <Typography
                    variant="h5"
                    sx={{ color: "skyblue", fontWeight: "bold" }}
                  >
                    New Users
                  </Typography>
                }
                progress={newClientsData.percentageToday / 100}
                increase={`+${newClientsData.percentageToday}%`}
                icon={<PersonAddIcon style={{ color: "green" }} />}
              />
            </Box>
          ) : (
            <CircularProgress color="primary" />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {!isLoading && disabledCardsData ? (
            <Box
              bgcolor={theme.palette.grey[900]}
              p={2}
              borderRadius={10}
              textAlign="center"
              display="flex"
              justifyContent="center"
              sx={{
                transition: "background-color 0.3s",
                "&:hover": { bgcolor: theme.palette.grey[800] },
              }}
            >
              <StatBox
                title={disabledCardsData.totalCarte.toString()}
                subtitle={
                  <Typography
                    variant="h5"
                    sx={{ color: "skyblue", fontWeight: "bold" }}
                  >
                    Disabled Cards
                  </Typography>
                }
                progress={disabledCardsData.percentageCartesDesactivees / 100}
                increase={
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {`+${disabledCardsData.percentageCartesDesactivees}%`}
                  </Typography>
                }
                icon={<BlockIcon style={{ color: "red" }} />}
              />
            </Box>
          ) : (
            <CircularProgress color="primary" />
          )}
        </Grid>
      </Grid>

      {isLoading && <CircularProgress color="primary" />}
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      <Box
        display="centre"
        justifyContent="center"
        alignItems="center"
        height="210px"
        width="55%" 
        mx="flex" 
        mt={2}
        mb={0} 
      >
       <Bar/>
      </Box>
    </Box>
  );
}

export default Dashboard;
