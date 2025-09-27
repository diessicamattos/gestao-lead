// rep/src/hooks/useAuth.ts
import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

type Ctx = {
  user: User | null;
  setUser: (u: User | null) => void;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthCtx = createContext<Ctx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Mantém sessão persistida e atualiza estado em tempo real
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value: Ctx = useMemo(
    () => ({
      user,
      setUser,
      async login(email: string, pass: string) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        setUser(cred.user); // atualiza estado manualmente
      },
      async logout() {
        await signOut(auth);
        setUser(null);
      },
    }),
    [user]
  );

  // Enquanto verifica a sessão, pode renderizar um "carregando"
  if (loading) {
    return <div>Carregando...</div>;
  }

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
