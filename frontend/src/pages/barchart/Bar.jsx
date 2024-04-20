import React, { useEffect, useState } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { Box, CircularProgress, Typography, colors, useTheme } from "@mui/material";
import { transformData } from "./tronsformdat";

function Bar() {
  const theme = useTheme(); // Access the current theme using useTheme hook
  const [data, setData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function extractKeys(data) {
    const keys = new Set();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (key !== "statut") keys.add(key);
      });
    });
    return Array.from(keys);
  }

  useEffect(() => {
    fetch("http://localhost:5000/stats")
      .then((response) => response.json())
      .then((data) => {
        const transformedData = transformData(data);
        const keys = extractKeys(transformedData);
        setData(transformedData);
        setKeys(keys);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.toString());
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (data.length === 0) return <Typography>No data available</Typography>;

  return (
    <Box sx={{ height: "75vh", width: "90%", position: "relative" }}>
      <div style={{ width: "90%", height: "100%" }}>
        <div
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "10vh",
          }}
        >
          <h1>les badges utiliser selon leurs status</h1>
        </div>

        <ResponsiveBar
          data={data}
          theme={{
            axis:{
              domain:{
                line:{
                  stroke:colors.grey[100],
                },
              },
              legend:{
                text:{
                  fill:colors.grey[100]
                },
              },
              ticks:{
                line:{
                  stroke: colors.grey[100],
                  strokeWidth:1,
                },
                text:{
                  fill:colors.grey[100]
                }
              },
              

            }
          }}
          keys={keys}
          indexBy="statut"
          margin={{ top: 50, right: 80, bottom: 50, left: 90 }}
          padding={0.3}
          colors={{ scheme: "dark2" }}
          borderColor={{ from: "color", modifiers: [["darker", 100]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 10,
            tickPadding: 10,
            tickRotation: 0,
            legend: "Status",
            legendPosition: "middle",
            legendOffset: 45,
            // @ts-ignore
            tickFontFamily: theme.typography.fontFamily, // Use theme font family
            tickFontSize: theme.typography.body1.fontSize, // Use theme body1 font size
            tickTextColor: theme.palette.text.primary, // Use theme primary text color
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 10,
            tickRotation: 0,
            legend: "Count",
            legendPosition: "middle",
            legendOffset: -70,
            // @ts-ignore
            tickFontFamily: theme.typography.fontFamily, // Use theme font family
            tickFontSize: theme.typography.body1.fontSize, // Use theme body1 font size
            tickTextColor: theme.palette.text.primary, // Use theme primary text color
          }}
          labelSkipWidth={18}
          labelSkipHeight={12}
          labelTextColor={theme.palette.text.primary} // Use theme primary text color
        />
      </div>
      <style>
        {`
          .nivo-axis text {
            fill: white;
          }
        `}
      </style>
    </Box>
  );
}

export default Bar;
