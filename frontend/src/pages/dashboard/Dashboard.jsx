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
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BlockIcon from "@mui/icons-material/Block";
import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import StatBox from "pages/stattbox/StatBox";
import Bar from "pages/barchart/Bar";
import Evenements from "pages/evenements/Evenements";
import Timeline from "pages/timelinechart/Timeline";

import Piechart from "pages/piechart/Piechart";

function Dashboard() {
  const theme = useTheme();
  const [newEventsData, setNewEventsData] = useState(null);
  const [newAcceptedeventData, setNewAcceptedeventData] = useState(null);
  const [newClientsData, setNewClientsData] = useState(null);
  const [disabledCardsData, setDisabledCardsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, cardResponse, eventResponse,acceptedeventResponse] = await Promise.all([
          fetch("http://localhost:5000/userparjour"),
          fetch("http://localhost:5000/cartedesa"),
          fetch("http://localhost:5000/dailyevent"),
          fetch("http://localhost:5000/dailyacceptedevents"),
        ]);

        if (!userResponse.ok || !cardResponse.ok || !eventResponse.ok || !acceptedeventResponse) {
          throw new Error("Failed to fetch data");
        }

        const [userData, cardData, eventData,acceptedeventData] = await Promise.all([
          userResponse.json(),
          cardResponse.json(),
          eventResponse.json(),
          acceptedeventResponse.json()
        ]);

        setNewClientsData(userData);
        setDisabledCardsData(cardData);
        setNewEventsData(eventData);
        setNewAcceptedeventData(acceptedeventData)
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box textAlign="center">
        <CircularProgress color="primary" />
        <Typography>Loading Data...</Typography>
      </Box>
    );
  }

  return (
    <Box m={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold" color="white">
          tableau de bord
        </Typography>
        
      </Box>
      
      <Grid container spacing={5} mt={3}>
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
           {newEventsData ? (
            <StatBox
              title={Math.floor(newEventsData.totalevents).toString()}
              subtitle={
                <Typography variant="h5" style={{ color: "lightblue", fontWeight: "bold" }}>
                  New Events
                </Typography>
              }
              progress={newEventsData.percentageToday / 100}
              increase={`+${newEventsData.percentageToday}%`}
              icon={<EventIcon />}
            />
          ) : (
            <Typography style={{ color: "lightgray" }}>Data not available</Typography>
          )}
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
             {newAcceptedeventData? (
            <StatBox
            title={Math.floor(newAcceptedeventData.nb_total_event_accepted).toString()}
              subtitle={
                <Typography
                  variant="h5"
                  sx={{ color: "skyblue", fontWeight: "bold" }}
                >
                accpted event
                </Typography>
              }
              progress={newAcceptedeventData.percentageToday / 100}
              increase={`+${newAcceptedeventData.percentageToday}%`}
              icon={<EventAvailableIcon />}
              />
            ) : (
              <Typography style={{ color: "lightgray" }}>Data not available</Typography>
            )}
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Bar />
        <Timeline/>
        </Grid>

        <Grid item xs={12} md={6} mt={20}>
          <Evenements />
         <Grid item >
          <Piechart/>
         </Grid>
        </Grid>
      </Grid>
      
    
      
    </Box>
  );
}

export default Dashboard;
