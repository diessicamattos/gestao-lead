// rep/src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1976d2" },
    secondary: { main: "#7c4dff" },
    success: { main: "#00C49F" },
    warning: { main: "#ffa726" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: { styleOverrides: { root: { borderRadius: 20 } } },
  },
});

export default theme;
