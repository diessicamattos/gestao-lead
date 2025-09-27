// rep/src/pages/Dashboard.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  IconButton,
  Grid,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CardKpi from "../components/CardKpi";
import { useLeads } from "../hooks/useLeads";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useMemo, useRef, useState } from "react";
import { ensureNotificationPermission, showDesktopNotification } from "../utils/notifications";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const leads = useLeads("todos");
  const { user, logout } = useAuth();

  const [openNotif, setOpenNotif] = useState(false);
  const [newLeadName, setNewLeadName] = useState<string | null>(null);
  const prevCount = useRef(0);

  // Realtime notif ao receber novo lead
  useEffect(() => {
    if (leads.length > prevCount.current) {
      const ultimo = leads[0];
      const name = ultimo?.nome || "Novo lead";
      setNewLeadName(name);
      setOpenNotif(true);
      ensureNotificationPermission().then((ok) => {
        if (ok) showDesktopNotification("Novo lead atribuído", name);
      });
    }
    prevCount.current = leads.length;
  }, [leads]);

  const kpis = useMemo(() => {
    const total = leads.length;
    const novos = leads.filter((l) => !l.status || l.status === "novo").length;
    const emTrat = leads.filter(
      (l) => l.status === "em_negociacao" || l.status === "contatado"
    ).length;
    const conv = leads.filter((l) => l.status === "convertido").length;
    return { total, novos, emTrat, conv };
  }, [leads]);

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Meus Leads
          </Typography>
          {user && (
            <>
              <Avatar
                src={user.photoURL || undefined}
                alt={user.email || ""}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <IconButton color="inherit" onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Box onClick={() => nav("/leads/todos")} sx={{ cursor: "pointer" }}>
            <CardKpi title="Total" value={kpis.total} color="info.main" icon={<PeopleIcon />} />
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box onClick={() => nav("/leads/novos")} sx={{ cursor: "pointer" }}>
            <CardKpi title="Novos" value={kpis.novos} color="primary.main" icon={<NewReleasesIcon />} />
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box onClick={() => nav("/leads/em-tratativa")} sx={{ cursor: "pointer" }}>
            <CardKpi title="Em tratativa" value={kpis.emTrat} color="secondary.main" icon={<PhoneInTalkIcon />} />
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box onClick={() => nav("/leads/convertidos")} sx={{ cursor: "pointer" }}>
            <CardKpi title="Convertidos" value={kpis.conv} color="success.main" icon={<CheckCircleIcon />} />
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={openNotif}
        autoHideDuration={3000}
        onClose={() => setOpenNotif(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="info" onClose={() => setOpenNotif(false)}>
          Novo lead atribuído: <strong>{newLeadName}</strong>
        </Alert>
      </Snackbar>
    </Box>
  );
}
