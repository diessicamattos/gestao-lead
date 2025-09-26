// src/hooks/useAuthRole.ts
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export type Role = "admin" | "vendedora" | "anon";

export function useAuthRole() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>("anon");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) { setRole("anon"); setLoading(false); return; }
      const ref = doc(db, "users", u.uid);
      const unsubDoc = onSnapshot(ref, (snap) => {
        const r = (snap.data()?.role as Role) || "vendedora";
        setRole(r); setLoading(false);
      });
      return () => unsubDoc();
    });
    return () => unsubAuth();
  }, []);

  return { user, role, loading };
}
