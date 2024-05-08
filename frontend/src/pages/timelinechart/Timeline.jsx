import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { CircularProgress, Typography, colors, useTheme } from "@mui/material";

function Timeline() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme(); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/dailyuser');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des données');
                }
                const responseData = await response.json();
                setData(responseData.dailyUserCount);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ height: '30vh', position: 'relative' }}>
            
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
           
                {loading && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <CircularProgress color="primary" />
                    </div>
                )}
                {data && (
                    <ResponsiveLine
                        data={[{ id: 'users', data: data.map(entry => ({ x: entry.day, y: entry.count })) }]}
                        theme={{
                            axis:{
                                domain:{
                                    line:{
                                        stroke:colors.grey[200],
                                    },
                                },
                                legend:{
                                    text:{
                                        fill:colors.grey[400]
                                    },
                                },
                                ticks:{
                                    line:{
                                        stroke: colors.grey[200],
                                        strokeWidth:1,
                                    },
                                    text:{
                                        fill:colors.grey[400]
                                    }
                                },
                            }
                        }}
                        margin={{ top: 50, right: 110, bottom: 50, left: 60 }} // Adjusted top margin
                        xScale={{ type: 'point' }}
                        yScale={{
                            type: 'linear',
                            min: 'auto',
                            max: 'auto',
                            stacked: true,
                            reverse: false
                        }}
                        yFormat=" >-.2f"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Jour',
                            legendOffset: 36,
                            legendPosition: 'middle'
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'Count',
                            legendOffset: -40,
                            legendPosition: 'middle',
                            truncateTickAt: 0
                        }}
                        pointSize={10}
                        pointColor={{ theme: 'background' }}
                        pointBorderWidth={2}
                        pointBorderColor={{ from: 'serieColor' }}
                        pointLabelYOffset={-12}
                        enableTouchCrosshair={true}
                        useMesh={true}
                        enableGridX={false} // Remove horizontal grid lines
                        enableGridY={false} // Remove vertical grid lines
                        legends={[
                            {
                                anchor: 'bottom-right',
                                direction: 'column',
                                justify: false,
                                translateX: 100,
                                translateY: 0,
                                itemsSpacing: 0,
                                itemDirection: 'left-to-right',
                                itemWidth: 80,
                                itemHeight: 20,
                                itemOpacity: 0.75,
                                symbolSize: 12,
                                symbolShape: 'circle',
                                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                                effects: [
                                    {
                                        on: 'hover',
                                        style: {
                                            itemBackground: 'rgba(0, 0, 0, .03)',
                                            itemOpacity: 1
                                        }
                                    }
                                ]
                            }
                        ]}
                    />
                )}
                {error && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                        <Typography variant="body1" color="error">
                            {error}
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Timeline;
