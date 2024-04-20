import React from 'react'
import { Box, colors, useTheme } from "@mui/material";
function ProgressCircle({ progress = 0.75, size = "40" }) {
    const theme = useTheme();
    const angle = progress * 360;
  return (
    <Box
    sx={{
      background: `radial-gradient(${colors.grey[900]} 55%, transparent 56%),
          conic-gradient(transparent 0deg ${angle}deg, ${colors.blue[500]} ${angle}deg 360deg),
          ${colors.green[500]}`,
      borderRadius: "50%",
      width: `${size}px`,
      height: `${size}px`,
    }}
  />
  )
}

export default ProgressCircle