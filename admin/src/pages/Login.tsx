// admin/src/pages/Login.tsx
import { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../src/firebase";
import { Box, Button, Card, CardContent, TextField, Typography, Stack } from "@mui/material";
import { enqueueSnackbar } from "notistack";

export default function Login(){
  const [email,setEmail] = useState(""); const [pass,setPass] = useState("");

  async function doLogin(e:any){
    e.preventDefault();
    try { await signInWithEmailAndPassword(auth, email, pass); }
    catch (e:any){ enqueueSnackbar(e.message, { variant:"error" }); }
  }
  async function forgot(){
    if (!email) return enqueueSnackbar("Informe o email", { variant:"warning" });
    try { await sendPasswordResetEmail(auth, email); enqueueSnackbar("Email de recuperação enviado", { variant:"info" }); }
    catch (e:any){ enqueueSnackbar(e.message, { variant:"error" }); }
  }

  return (
    <Box sx={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",p:2}}>
      <Card sx={{maxWidth:380, width:"100%"}}>
        <CardContent>
          <Typography variant="h5" mb={2}>Entrar</Typography>
          <form onSubmit={doLogin}>
            <Stack spacing={2}>
              <TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} />
              <TextField label="Senha" type="password" value={pass} onChange={e=>setPass(e.target.value)} />
              <Button type="submit" variant="contained">Entrar</Button>
              <Button type="button" onClick={forgot}>Esqueci minha senha</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
