// admin/src/App.tsx
import { ThemeProvider, CssBaseline, Container } from "@mui/material";
import theme from "./theme"; // sem chaves
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} autoHideDuration={3500}>
        <BrowserRouter>
          <Container maxWidth="lg" sx={{ py: 3 }}>
            <AppRoutes />
          </Container>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
