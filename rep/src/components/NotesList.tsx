// rep/src/components/NotesList.tsx
import { useState } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { arrayUnion, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function NotesList({
  leadId,
  notes,
  currentUser,
}: {
  leadId: string;
  notes?: Array<{ msg: string; user: string; ts: any }>;
  currentUser: string;
}) {
  const [msg, setMsg] = useState("");

  async function addNote() {
    if (!msg.trim()) return;
    await updateDoc(doc(db, "leads", leadId), {
      notas: arrayUnion({
        msg: msg.trim(),
        user: currentUser || "Representante",
        ts: serverTimestamp(),
      }),
      historico: arrayUnion({
        acao: "Nova nota adicionada",
        usuario: currentUser || "Representante",
        ts: serverTimestamp(),
      }),
      updatedAt: serverTimestamp(),
    });
    setMsg("");
  }

  const items = (notes || []).slice().sort((a, b) => {
    const ta = a.ts?.seconds || 0;
    const tb = b.ts?.seconds || 0;
    return tb - ta;
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Anotações
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          label="Adicionar nota"
          size="small"
          fullWidth
        />
        <Button variant="contained" onClick={addNote}>
          Salvar
        </Button>
      </Box>
      <List dense>
        {items.map((n, i) => (
          <ListItem key={i} divider>
            <ListItemText
              primary={n.msg}
              secondary={`${n.user} — ${
                n.ts?.toDate ? n.ts.toDate().toLocaleString() : ""
              }`}
            />
          </ListItem>
        ))}
        {items.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Sem notas ainda.
          </Typography>
        )}
      </List>
    </Box>
  );
}
