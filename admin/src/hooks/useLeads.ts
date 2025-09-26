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
  updatedAt?: any; // 🔹 novo: última atualização
  assignedTo?: string | null;
  status?: "novo" | "em_negociacao" | "contatado" | "convertido" | string | null;

  // 🔹 novos campos para histórico e anotações
  historico?: {
    acao: string;       // Ex: "Status alterado para Contatado"
    usuario: string;    // Nome ou UID de quem fez
    data: any;          // Timestamp
  }[];
  notas?: {
    texto: string;
    usuario: string;    // Quem deixou a nota
    data: any;          // Timestamp
  }[];
}

export function useLeads(filters?: { origem?: string; q?: string }) {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const qRef = query(collection(db, "leads"), orderBy("criadoEm", "desc"));
    const unsub = onSnapshot(qRef, (snap) => {
      setLeads(
        snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Lead),
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
          (l.telefone || "").toLowerCase().includes(q) ||
          (l.status || "").toLowerCase().includes(q) ||
          (l.assignedTo || "").toLowerCase().includes(q)
      );
    }
    return arr;
  }, [leads, filters?.origem, filters?.q]);

  return filtered;
}
