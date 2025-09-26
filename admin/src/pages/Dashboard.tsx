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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const leads = useLeads();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  // gráfico por período
  const [period, setPeriod] = useState<"diario" | "semanal" | "mensal">("diario");

  // estado para notificação
  const [openNotif, setOpenNotif] = useState(false);
  const [newLeadName, setNewLeadName] = useState<string | null>(null);
  const prevCount = useRef(0);

  // buscar nome do usuário logado
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

  // buscar lista de representantes
  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const reps = snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }));
      setUsers(reps);
    };
    fetchUsers();
  }, []);

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
    const pend = leads.filter((l) => !!l.assignedTo && l.status === "novo").length;
    const emTrat = leads.filter(
      (l) => l.status === "em_negociacao" || l.status === "contatado"
    ).length;
    const conv = leads.filter((l) => l.status === "convertido").length;
    return { total, novos, pend, emTrat, conv };
  }, [leads]);

  // performance por representante
  const perfRep = useMemo(() => {
    return users.map((u) => {
      const atribu = leads.filter((l) => l.assignedTo === u.uid).length;
      const emTrat = leads.filter(
        (l) =>
          l.assignedTo === u.uid &&
          (l.status === "em_negociacao" || l.status === "contatado")
      ).length;
      const conv = leads.filter(
        (l) => l.assignedTo === u.uid && l.status === "convertido"
      ).length;
      return { nome: u.nome || u.displayName || "Sem Nome", atribu, emTrat, conv };
    });
  }, [leads, users]);

  // taxa de conversão
  const taxaConv = useMemo(() => {
    if (kpis.total === 0) return 0;
    return ((kpis.conv / kpis.total) * 100).toFixed(1);
  }, [kpis]);

  // gráfico por período
  const leadsPeriodo = useMemo(() => {
    const agrupado: Record<string, number> = {};
    leads.forEach((l) => {
      if (!l.criadoEm?.toDate) return;
      const d = l.criadoEm.toDate();
      let chave = "";
      if (period === "diario") {
        chave = d.toLocaleDateString();
      } else if (period === "semanal") {
        const semana = `${d.getFullYear()}-S${Math.ceil(d.getDate() / 7)}`;
        chave = semana;
      } else if (period === "mensal") {
        chave = `${d.getMonth() + 1}/${d.getFullYear()}`;
      }
      agrupado[chave] = (agrupado[chave] || 0) + 1;
    });
    return Object.entries(agrupado).map(([periodo, qtd]) => ({
      periodo,
      qtd,
    }));
  }, [leads, period]);

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      {/* Banner logo */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <img
          src="/logo.jpg"
          alt="Logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </Box>

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

      {/* Performance por representante */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Performance por Representante
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={perfRep} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="nome" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="atribu"
              fill="#4e79a7"
              name="Atribuídos"
              radius={[8, 8, 0, 0]}
              label={{ position: "top", fill: "#fff" }}
            />
            <Bar
              dataKey="emTrat"
              fill="#f28e2b"
              name="Em Tratativa"
              radius={[8, 8, 0, 0]}
              label={{ position: "top", fill: "#fff" }}
            />
            <Bar
              dataKey="conv"
              fill="#76b7b2"
              name="Convertidos"
              radius={[8, 8, 0, 0]}
              label={{ position: "top", fill: "#fff" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Taxa de conversão */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Taxa de Conversão
        </Typography>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={[
                { name: "Convertidos", value: kpis.conv },
                { name: "Não Convertidos", value: kpis.total - kpis.conv },
              ]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              <Cell fill="#00C49F" />
              <Cell fill="#444" />
            </Pie>
            <Tooltip />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: "24px", fontWeight: "bold", fill: "#00C49F" }}
            >
              {taxaConv}%
            </text>
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Gráfico por período */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Leads por Período</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Período</InputLabel>
            <Select
              value={period}
              label="Período"
              onChange={(e) => setPeriod(e.target.value as any)}
            >
              <MenuItem value="diario">Diário</MenuItem>
              <MenuItem value="semanal">Semanal</MenuItem>
              <MenuItem value="mensal">Mensal</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={leadsPeriodo}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodo" tick={{ fill: "#ccc" }} />
            <YAxis tick={{ fill: "#ccc" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="qtd"
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* Snackbar de notificação */}
      <Snackbar
        open={openNotif}
        autoHideDuration={3000}
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
