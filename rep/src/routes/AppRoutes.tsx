// rep/src/routes/AppRoutes.tsx
import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuthRole } from "../../src/hooks/useAuthRole";
import Login from "../pages/Login";
import MyLeads from "../pages/MyLeads";

export default function AppRoutes(){
  const { role, loading } = useAuthRole();
  const navigate = useNavigate();

  useEffect(()=>{
    if (loading) return;
    if (role==="vendedora") navigate("/rep");
  },[loading, role]);

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/rep" element={role==="vendedora" ? <MyLeads/> : <Navigate to="/login"/>} />
      <Route path="/" element={<Navigate to={role==="vendedora" ? "/rep" : "/login"} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
