// admin/src/components/AssignLeadDialog.tsx
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function AssignLeadDialog({
  open,
  onClose,
  leadId,
}: {
  open: boolean;
  onClose: () => void;
  leadId: string;
}) {
  const [users, setUsers] = useState<{ uid: string; displayName?: string }[]>(
    []
  );
  const [uid, setUid] = useState("");

  useEffect(() => {
    if (!open) return;
    (async () => {
      const q = query(collection(db, "users"), where("role", "==", "vendedora"));
      const s = await getDocs(q);
      setUsers(
        s.docs.map((d) => ({
          uid: d.id,
          displayName: (d.data() as any).displayName,
        }))
      );
    })();
  }, [open]);

  async function atribuir() {
    const user = users.find((u) => u.uid === uid);
    await updateDoc(doc(db, "leads", leadId), {
      assignedTo: uid || null,
      assignedName: user?.displayName || null,
      updatedAt: serverTimestamp(),
      historico: arrayUnion({
        acao: `Lead atribuído para ${user?.displayName || "Admin"}`,
        usuario: "Sistema",
        data: new Date().toISOString(), // ✅ corrigido
      }),
    } as any);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Atribuir lead</DialogTitle>
      <DialogContent>
        <TextField
          select
          label="Vendedora"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          fullWidth
          sx={{ mt: 1 }}
        >
          {users.map((u) => (
            <MenuItem key={u.uid} value={u.uid}>
              {u.displayName || u.uid}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={atribuir} variant="contained" disabled={!uid}>
          Atribuir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
