// src/theme.ts
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#6c5ce7" },
    success: { main: "#2ecc71" },
    warning: { main: "#fd7e14" },
    error: { main: "#e74c3c" },
    background: { default: "#f8f9fb", paper: "#ffffff" }
  },
  shape: { borderRadius: 10 }
});
