// admin/src/theme.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark", // 🌙 Dark mode por padrão
    primary: {
      main: "#4dabf7", // azul
    },
    secondary: {
      main: "#9775fa", // roxo
    },
    success: {
      main: "#51cf66", // verde
    },
    warning: {
      main: "#ffa94d", // laranja
    },
    error: {
      main: "#ff6b6b", // vermelho
    },
    background: {
      default: "#121212", // fundo da página
      paper: "#1e1e1e", // fundo dos cards
    },
    text: {
      primary: "#f1f3f5", // texto claro
      secondary: "#adb5bd", // texto apagado
    },
  },
  shape: {
    borderRadius: 12, // bordas arredondadas nos componentes
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // remove gradiente do MUI
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default theme;
