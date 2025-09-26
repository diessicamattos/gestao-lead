// rep/src/hooks/useMyLeads.ts
import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  origem?: "site" | "instagram" | "whatsapp" | "outro";
  status: "novo" | "contatado" | "em_negociacao" | "convertido" | "perdido";
  assignedTo: string | null;
  assignedName?: string | null;
  createdAt?: any;
  updatedAt?: any;
}

export function useMyLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const qRef = query(
      collection(db, "leads"),
      where("assignedTo", "==", uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(qRef, (snap) => {
      setLeads(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
    });
    return () => unsub();
  }, [auth.currentUser?.uid]);

  return leads;
}
