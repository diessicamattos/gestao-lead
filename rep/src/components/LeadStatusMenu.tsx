// rep/src/components/LeadStatusMenu.tsx
import { Menu, MenuItem } from "@mui/material";
import { doc, updateDoc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { db } from "../firebase";

export default function LeadStatusMenu({
  anchorEl,
  onClose,
  leadId,
  userEmail,
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  leadId: string | null;
  userEmail: string;
}) {
  const open = Boolean(anchorEl);

  async function setStatus(status: string) {
    if (!leadId) return;
    await updateDoc(doc(db, "leads", leadId), {
      status,
      updatedAt: serverTimestamp(),
      historico: arrayUnion({
        acao: `Status alterado para ${status}`,
        usuario: userEmail || "Representante",
        ts: serverTimestamp(),
      }),
    });
    onClose();
  }

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      <MenuItem onClick={() => setStatus("novo")}>Marcar como Novo</MenuItem>
      <MenuItem onClick={() => setStatus("contatado")}>Contatado</MenuItem>
      <MenuItem onClick={() => setStatus("em_negociacao")}>Em Negociação</MenuItem>
      <MenuItem onClick={() => setStatus("convertido")}>Convertido</MenuItem>
    </Menu>
  );
}
