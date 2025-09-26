// admin/src/pages/Dashboard.tsx
import { useMemo, useEffect, useState, useRef } from "react";
import { useLeads } from "../hooks/useLeads";
import {
  Grid,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CardKpi from "../components/CardKpi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const leads = useLeads();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);

  // estado para notificação
  const [openNotif, setOpenNotif] = useState(false);
  const [newLeadName, setNewLeadName] = useState<string | null>(null);
  const prevCount = useRef(0);

  // buscar nome do usuário na coleção users
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user?.uid) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setDisplayName(
            data.nome || data.displayName || user.displayName || user.email || ""
          );
        } else {
          setDisplayName(user.displayName || user.email || "");
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  // detectar novos leads
  useEffect(() => {
    if (leads.length > prevCount.current) {
      const ultimo = leads[0];
      setNewLeadName(ultimo?.nome || "Novo lead");
      setOpenNotif(true);
    }
    prevCount.current = leads.length;
  }, [leads]);

  // KPIs calculados
  const kpis = useMemo(() => {
    const total = leads.length;
    const novos = leads.filter((l) => !l.status || l.status === "novo").length;

    // corrigido: pendentes = assignedTo preenchido + status = novo
    const pend = leads.filter(
      (l) => !!l.assignedTo && l.status === "novo"
    ).length;

    const emTrat = leads.filter(
      (l) => l.status === "em_negociacao" || l.status === "contatado"
    ).length;
    const conv = leads.filter((l) => l.status === "convertido").length;

    return { total, novos, pend, emTrat, conv };
  }, [leads]);

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* Topbar */}
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            Painel Admin
          </Typography>
          {user && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                sx={{ mr: 2, fontSize: { xs: "0.8rem", sm: "1rem" } }}
              >
                {displayName}
              </Typography>
              <Avatar
                src={user.photoURL || undefined}
                alt={displayName || ""}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <IconButton color="inherit" onClick={logout}>
                <LogoutIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* KPIs */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6} sm={4} md={2.4}>
          <Box onClick={() => navigate("/leads/todos")} sx={{ cursor: "pointer" }}>
            <CardKpi
              title="Total"
              value={kpis.total}
              color="info.main"
              icon={<PeopleIcon fontSize="large" />}
            />
          </Box>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Box onClick={() => navigate("/leads/novos")} sx={{ cursor: "pointer" }}>
            <CardKpi
              title="Novos"
              value={kpis.novos}
              color="primary.main"
              icon={<NewReleasesIcon fontSize="large" />}
            />
          </Box>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Box
            onClick={() => navigate("/leads/pendentes")}
            sx={{ cursor: "pointer" }}
          >
            <CardKpi
              title="Pendentes"
              value={kpis.pend}
              color="warning.main"
              icon={<PendingActionsIcon fontSize="large" />}
            />
          </Box>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Box
            onClick={() => navigate("/leads/em-tratativa")}
            sx={{ cursor: "pointer" }}
          >
            <CardKpi
              title="Em tratativa"
              value={kpis.emTrat}
              color="secondary.main"
              icon={<PhoneInTalkIcon fontSize="large" />}
            />
          </Box>
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <Box
            onClick={() => navigate("/leads/convertidos")}
            sx={{ cursor: "pointer" }}
          >
            <CardKpi
              title="Convertidos"
              value={kpis.conv}
              color="success.main"
              icon={<CheckCircleIcon fontSize="large" />}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar de notificação */}
      <Snackbar
        open={openNotif}
        autoHideDuration={3000} // agora fecha sozinho em 3s
        onClose={() => setOpenNotif(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="info" onClose={() => setOpenNotif(false)}>
          Novo lead recebido: <strong>{newLeadName}</strong>
        </Alert>
      </Snackbar>
    </Box>
  );
}
