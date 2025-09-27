// rep/src/pages/LeadsListPage.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate, useParams } from "react-router-dom";
import { useLeads, Lead } from "../hooks/useLeads";
import { useAuth } from "../hooks/useAuth";
import { useMemo, useState } from "react";
import { sanitizePhone } from "../utils/phone";
import LeadStatusMenu from "../components/LeadStatusMenu";

type LeadExt = Lead;

const titles: Record<string, string> = {
  novos: "Novos",
  "em-tratativa": "Em Tratativa",
  convertidos: "Convertidos",
  todos: "Todos",
};

export default function LeadsListPage() {
  const { type } = useParams<{ type: string }>();
  const leads = useLeads(type);
  const nav = useNavigate();
  const { user } = useAuth();

  const [anchorStatusEl, setAnchorStatusEl] = useState<HTMLElement | null>(null);
  const [statusLeadId, setStatusLeadId] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      leads.slice().sort((a, b) => {
        const ta = a.criadoEm?.seconds || 0;
        const tb = b.criadoEm?.seconds || 0;
        return tb - ta;
      }),
    [leads]
  );

  function openStatusMenu(e: React.MouseEvent<HTMLButtonElement>, leadId: string) {
    setAnchorStatusEl(e.currentTarget);
    setStatusLeadId(leadId);
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <AppBar position="static" color="default" elevation={0} sx={{ mb: 2 }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => nav("/")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            Leads — {titles[type || "todos"] || "Todos"}
          </Typography>
        </Toolbar>
      </AppBar>

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
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sorted.map((l) => {
                const numero = sanitizePhone(l.telefone || "");
                return (
                  <TableRow key={l.id}>
                    <TableCell>
                      <Typography>{l.nome}</Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ display: { xs: "block", sm: "none" } }}
                      >
                        {l.telefone}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      {l.telefone}
                    </TableCell>
                    <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      {l.status || "novo"}
                    </TableCell>
                    <TableCell align="center">
                      {numero && (
                        <IconButton
                          color="success"
                          component="a"
                          href={`https://wa.me/${numero}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Iniciar chat no WhatsApp"
                          title="Iniciar chat"
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      )}

                      <IconButton onClick={() => nav(`/lead/${l.id}`)} title="Ver detalhes">
                        <VisibilityIcon />
                      </IconButton>

                      <IconButton onClick={(e) => openStatusMenu(e, l.id)} title="Alterar status">
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Nenhum lead aqui ainda.
                      </Typography>
                      <Button sx={{ mt: 1 }} onClick={() => nav("/")}>
                        Voltar ao painel
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <LeadStatusMenu
        anchorEl={anchorStatusEl}
        onClose={() => setAnchorStatusEl(null)}
        leadId={statusLeadId}
        userEmail={user?.email || "Representante"}
      />
    </Box>
  );
}
