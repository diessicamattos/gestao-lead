// rep/src/hooks/useLeads.ts
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./useAuth";

export type Lead = {
  id: string;
  nome: string;
  telefone: string;
  origem?: string;
  criadoEm?: any; // Timestamp
  assignedTo?: string | null;
  status?: "novo" | "em_negociacao" | "contatado" | "convertido" | string | null;
  historico?: Array<any>;
  notas?: Array<{ msg: string; user: string; ts: any }>;
};

export function useLeads(type?: string) {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    // assignedTo == rep atual
    const qRef = query(
      collection(db, "leads"),
      where("assignedTo", "==", user.uid),
      orderBy("criadoEm", "desc")
    );

    const unsub = onSnapshot(qRef, (snap) => {
      setLeads(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Lead[]
      );
    });

    return () => unsub();
  }, [user?.uid]);

  const filtered = useMemo(() => {
    if (!type) return leads;
    if (type === "novos")
      return leads.filter((l) => !l.status || l.status === "novo");
    if (type === "em-tratativa")
      return leads.filter(
        (l) => l.status === "em_negociacao" || l.status === "contatado"
      );
    if (type === "convertidos") return leads.filter((l) => l.status === "convertido");
    return leads; // "todos"
  }, [leads, type]);

  return filtered;
}
