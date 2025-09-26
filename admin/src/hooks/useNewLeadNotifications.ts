// admin/src/hooks/useNewLeadNotifications.ts
import { useEffect, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { enqueueSnackbar } from "notistack";

export function useNewLeadNotifications() {
  const initialized = useRef(false);

  useEffect(() => {
    const qRef = query(collection(db, "leads"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(qRef, (snap) => {
      // Ignora o primeiro carregamento (evita spam)
      if (!initialized.current) { initialized.current = true; return; }
      snap.docChanges().forEach(change => {
        if (change.type === "added") {
          const lead = change.doc.data() as any;
          enqueueSnackbar(`Novo lead: ${lead.nome} (${lead.telefone})`, { variant: "info" });
          if (Notification.permission === "granted") {
            new Notification("🆕 Novo lead", { body: `${lead.nome} - ${lead.telefone}` });
          }
        }
      });
    });
    return () => unsub();
  }, []);
}
