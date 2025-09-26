// rep/src/pages/MyLeads.tsx
import { Grid, Paper, Typography } from "@mui/material";
import CardKpi from "../../src/components/CardKpi";
import LeadTableMy from "../components/LeadTableMy";
import { useMyLeads } from "../hooks/useMyLeads";
import { useAuthRole } from "../../src/hooks/useAuthRole";
import { useMemo } from "react";

export default function MyLeads(){
  const leads = useMyLeads();
  const { user } = useAuthRole();

  const kpis = useMemo(()=>{
    const total = leads.length;
    const emTrat = leads.filter(l=>["em_negociacao","contatado"].includes(l.status)).length;
    const conv = leads.filter(l=>l.status==="convertido").length;
    return { total, emTrat, conv };
  },[leads]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}><CardKpi title="Total" value={kpis.total} color="primary.main"/></Grid>
        <Grid item xs={12} md={4}><CardKpi title="Em tratativa" value={kpis.emTrat} color="secondary.main"/></Grid>
        <Grid item xs={12} md={4}><CardKpi title="Convertidos" value={kpis.conv} color="success.main"/></Grid>
      </Grid>
      <Paper sx={{p:2, mt:3}}>
        <Typography variant="h6" mb={2}>Meus Leads</Typography>
        <LeadTableMy rows={leads} meName={user?.displayName || "Atendente"} />
      </Paper>
    </>
  );
}
