// rep/src/pages/LeadDetailsPage.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { sanitizePhone } from "../utils/phone";
import LeadStatusMenu from "../components/LeadStatusMenu";
import NotesList from "../components/NotesList";
import { useAuth } from "../hooks/useAuth";

export default function LeadDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { user } = useAuth();
  const [lead, setLead] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const unsub = onSnapshot(doc(db, "leads", id), (d) => setLead({ id: d.id, ...d.data() }));
    return () => unsub();
  }, [id]);

  const phone = useMemo(() => sanitizePhone(lead?.telefone || ""), [lead?.telefone]);

  // status menu
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const hist = useMemo(() => {
    const arr = Array.isArray(lead?.historico) ? lead.historico : [];
    return arr.slice().sort((a: any, b: any) => (b.ts?.seconds || 0) - (a.ts?.seconds || 0));
  }, [lead]);

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <AppBar position="static" color="default" elevation={0} sx={{ mb: 2 }}>
        <Toolbar>
          <IconButton edge="start" onClick={() => nav(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
            Detalhes do Lead
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} title="Alterar status">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">{lead?.nome || "-"}</Typography>
            <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label={`Telefone: ${lead?.telefone || "-"}`} />
              <Chip label={`Status: ${lead?.status || "novo"}`} color="primary" />
            </Box>

            {phone && (
              <Button
                variant="outlined"
                startIcon={<WhatsAppIcon />}
                sx={{ mt: 2 }}
                component="a"
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Iniciar chat pelo WhatsApp
              </Button>
            )}

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Histórico</Typography>
              <List dense>
                {hist.map((h: any, i: number) => (
                  <ListItem key={i} divider>
                    <ListItemText
                      primary={h.acao}
                      secondary={`${h.usuario} — ${
                        h.ts?.toDate ? h.ts.toDate().toLocaleString() : ""
                      }`}
                    />
                  </ListItem>
                ))}
                {hist.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum evento registrado ainda.
                  </Typography>
                )}
              </List>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <NotesList
              leadId={id!}
              notes={lead?.notas}
              currentUser={user?.email || "Representante"}
            />
          </Paper>
        </Grid>
      </Grid>

      <LeadStatusMenu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        leadId={id || null}
        userEmail={user?.email || "Representante"}
      />
    </Box>
  );
}
