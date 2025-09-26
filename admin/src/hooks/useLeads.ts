// admin/src/hooks/useLeads.ts
import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  origem?: string;
  aceitouLGPD?: boolean;
  criadoEm?: any; // Timestamp do Firestore
  assignedTo?: string | null; // 🔹 agora parte do tipo
  status?: "novo" | "em_negociacao" | "contatado" | "convertido" | string | null; // 🔹 também
}

export function useLeads(filters?: {
  origem?: string;
  q?: string;
}) {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const qRef = query(collection(db, "leads"), orderBy("criadoEm", "desc"));
    const unsub = onSnapshot(qRef, (snap) => {
      setLeads(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Lead), // 🔹 garante que os campos opcionais entrem
        }))
      );
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    let arr = [...leads];
    if (filters?.origem) arr = arr.filter((l) => l.origem === filters.origem);
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      arr = arr.filter(
        (l) =>
          (l.nome || "").toLowerCase().includes(q) ||
          (l.telefone || "").toLowerCase().includes(q)
      );
    }
    return arr;
  }, [leads, filters?.origem, filters?.q]);

  return filtered;
}
