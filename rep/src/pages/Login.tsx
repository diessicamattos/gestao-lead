// rep/src/pages/Login.tsx
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await login(email, pass);
      enqueueSnackbar("Bem-vindo(a)!", { variant: "success" });
      nav("/");
    } catch (e: any) {
      enqueueSnackbar(e.message, { variant: "error" });
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 380, width: "100%" }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Acessar
          </Typography>
          <form onSubmit={submit}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
              <TextField
                label="Senha"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                type="password"
                required
              />
              <Button type="submit" variant="contained">
                Entrar
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
