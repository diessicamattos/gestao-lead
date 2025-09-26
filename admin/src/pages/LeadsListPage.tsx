// admin/src/pages/LeadsListPage.tsx
import { useLeads, Lead } from "../hooks/useLeads";
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { db } from "../firebase";
import { doc, updateDoc, collection, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";

type LeadExtended = Lead & {
  assignedTo?: string | null;
  status?: "novo" | "em_negociacao" | "contatado" | "convertido" | string | null;
};

type User = {
  uid: string;
  nome: string;
  role?: string;
};

export default function LeadsListPage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const leadsBase = useLeads();
  const leads = leadsBase as LeadExtended[];

  // menus de ações
  const [anchorStatusEl, setAnchorStatusEl] = useState<null | HTMLElement>(null);
  const [anchorAssignEl, setAnchorAssignEl] = useState<null | HTMLElement>(null);
  const [selectedLead, setSelectedLead] = useState<LeadExtended | null>(null);

  // lista de representantes
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snap = await getDocs(collection(db, "users"));
      const reps = snap.docs
        .map((d) => ({ uid: d.id, ...(d.data() as any) }))
        .filter((u) => u.role === "representante");
      setUsers(reps);
    };
    fetchUsers();
  }, []);

  // status
  const handleOpenStatusMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    lead: LeadExtended
  ) => {
    setAnchorStatusEl(event.currentTarget);
    setSelectedLead(lead);
  };

  const handleCloseStatusMenu = () => {
    setAnchorStatusEl(null);
    setSelectedLead(null);
  };

  const handleUpdateStatus = async (status: string) => {
    if (selectedLead) {
      await updateDoc(doc(db, "leads", selectedLead.id), { status });
    }
    handleCloseStatusMenu();
  };

  // atribuição
  const handleOpenAssignMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    lead: LeadExtended
  ) => {
    setAnchorAssignEl(event.currentTarget);
    setSelectedLead(lead);
  };

  const handleCloseAssignMenu = () => {
    setAnchorAssignEl(null);
    setSelectedLead(null);
  };

  const handleAssignLead = async (uid: string) => {
    if (selectedLead) {
      await updateDoc(doc(db, "leads", selectedLead.id), { assignedTo: uid });
    }
    handleCloseAssignMenu();
  };

  // filtros
  let filtered = leads;
  if (type === "novos") {
    filtered = leads.filter((l) => !l.status || l.status === "novo");
  } else if (type === "pendentes") {
    filtered = leads.filter(
      (l) => !!l.assignedTo && (!l.status || l.status === "novo")
    );
  } else if (type === "em-tratativa") {
    filtered = leads.filter(
      (l) => l.status === "em_negociacao" || l.status === "contatado"
    );
  } else if (type === "convertidos") {
    filtered = leads.filter((l) => l.status === "convertido");
  } else {
    filtered = leads;
  }

  const titles: Record<string, string> = {
    novos: "Novos",
    pendentes: "Pendentes",
    "em-tratativa": "Em Tratativa",
    convertidos: "Convertidos",
    todos: "Todos os Leads",
  };

  return (
    <Box>
      {/* Topbar */}
      <AppBar position="static" color="default" elevation={0} sx={{ mb: 2 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => navigate("/admin")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            Leads — {titles[type || "todos"]}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Responsividade aplicada */}
      <Paper sx={{ p: { xs: 1, sm: 2 } }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  Telefone
                </TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                  Status
                </TableCell>
                <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                  Responsável
                </TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((l) => {
                const numero = (l.telefone || "").replace(/\D/g, "");
                const responsavel =
                  users.find((u) => u.uid === l.assignedTo)?.nome || "-";

                return (
                  <TableRow key={l.id}>
                    {/* Nome + detalhes no mobile */}
                    <TableCell>
                      <Typography>{l.nome}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "block", sm: "none" } }}>
                        {l.telefone}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "block", sm: "none" } }}>
                        Resp: {responsavel}
                      </Typography>
                    </TableCell>

                    {/* Telefone desktop */}
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      {l.telefone}
                    </TableCell>

                    {/* Status desktop */}
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      {l.status || "novo"}
                    </TableCell>

                    {/* Responsável desktop */}
                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                      {responsavel}
                    </TableCell>

                    <TableCell align="center">
                      {numero && (
                        <IconButton
                          color="success"
                          component="a"
                          href={`https://wa.me/${numero}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Chamar no WhatsApp"
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      )}
                      {/* Botão de atribuir */}
                      <IconButton onClick={(e) => handleOpenAssignMenu(e, l)}>
                        <PersonAddIcon />
                      </IconButton>
                      {/* Botão de status */}
                      <IconButton onClick={(e) => handleOpenStatusMenu(e, l)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Menu de status */}
      <Menu anchorEl={anchorStatusEl} open={Boolean(anchorStatusEl)} onClose={handleCloseStatusMenu}>
        <MenuItem onClick={() => handleUpdateStatus("novo")}>Marcar como Novo</MenuItem>
        <MenuItem onClick={() => handleUpdateStatus("contatado")}>Marcar como Contatado</MenuItem>
        <MenuItem onClick={() => handleUpdateStatus("em_negociacao")}>Em Negociação</MenuItem>
        <MenuItem onClick={() => handleUpdateStatus("convertido")}>Convertido</MenuItem>
      </Menu>

      {/* Menu de atribuição */}
      <Menu anchorEl={anchorAssignEl} open={Boolean(anchorAssignEl)} onClose={handleCloseAssignMenu}>
        <MenuItem onClick={() => handleAssignLead("admin")}>👤 Assumir</MenuItem>
        {users.length > 0 && (
          <>
            <MenuItem disabled>
              <strong>Atribuir a:</strong>
            </MenuItem>
            {users.map((u) => (
              <MenuItem key={u.uid} onClick={() => handleAssignLead(u.uid)}>
                {u.nome}
              </MenuItem>
            ))}
          </>
        )}
      </Menu>
    </Box>
  );
}
