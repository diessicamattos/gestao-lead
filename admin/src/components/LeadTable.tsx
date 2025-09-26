// admin/src/components/LeadTable.tsx
import { useState } from "react";
import { Paper, Toolbar, Typography, Grid, TextField, MenuItem, Button, Table, TableHead, TableRow, TableCell, TableBody, Chip, Stack } from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import WhatsappButton from "../../src/components/WhatsappButton";
import AssignLeadDialog from "./AssignLeadDialog";
import LeadEditDialog from "../../src/components/LeadEditDialog";
import { exportToCsv } from "../../src/utils/csv";
import { enqueueSnackbar } from "notistack";

export default function LeadTable({ rows, meName }:{ rows:any[]; meName:string }) {
  const [filters, setFilters] = useState({ status:"", origem:"", atribuido:"", q:"" });
  const [assignId, setAssignId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<any | null>(null);

  const filtered = rows.filter(r=>{
    if (filters.status && r.status!==filters.status) return false;
    if (filters.origem && r.origem!==filters.origem) return false;
    if (filters.atribuido==="sim" && !r.assignedTo) return false;
    if (filters.atribuido==="nao" && r.assignedTo) return false;
    if (filters.q) {
      const q = filters.q.toLowerCase();
      const hit = (r.nome||"").toLowerCase().includes(q) || (r.telefone||"").toLowerCase().includes(q) || (r.email||"").toLowerCase().includes(q);
      if (!hit) return false;
    }
    return true;
  });

  function exportCsv(){
    exportToCsv("leads-admin.csv", filtered.map(f=>({
      Nome: f.nome, Telefone: f.telefone, Email: f.email||"",
      Origem: f.origem||"", Status: f.status, Responsavel: f.assignedName||""
    })));
  }

  async function onDelete(id:string){
    if (!confirm("Excluir este lead?")) return;
    await deleteDoc(doc(db,"leads", id));
    enqueueSnackbar("Lead excluído", { variant:"success" });
  }

  return (
    <Paper sx={{mt:3}}>
      <Toolbar>
        <Typography variant="h6" sx={{flex:1}}>Leads</Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField label="Busca" size="small" value={filters.q} onChange={e=>setFilters({...filters,q:e.target.value})}/>
          <TextField label="Status" size="small" select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})}>
            <MenuItem value="">Todos</MenuItem>
            {["novo","contatado","em_negociacao","convertido","perdido"].map(s=><MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField label="Origem" size="small" select value={filters.origem} onChange={e=>setFilters({...filters,origem:e.target.value})}>
            <MenuItem value="">Todas</MenuItem>
            {["site","instagram","whatsapp","outro"].map(s=><MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField label="Atribuído" size="small" select value={filters.atribuido} onChange={e=>setFilters({...filters,atribuido:e.target.value})}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="sim">Sim</MenuItem>
            <MenuItem value="nao">Não</MenuItem>
          </TextField>
          <Button variant="outlined" onClick={exportCsv}>Exportar CSV</Button>
        </Stack>
      </Toolbar>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Origem</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Responsável</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map(r=>(
            <TableRow key={r.id}>
              <TableCell>{r.nome}</TableCell>
              <TableCell>{r.telefone}</TableCell>
              <TableCell>{r.email || "-"}</TableCell>
              <TableCell>{r.origem || "-"}</TableCell>
              <TableCell>
                <Chip size="small" label={r.status} color={
                  r.status==="convertido" ? "success" :
                  r.status==="perdido" ? "error" :
                  r.status==="em_negociacao" ? "secondary" :
                  r.status==="contatado" ? "primary" : "warning"
                }/>
              </TableCell>
              <TableCell>{r.assignedName || <Chip label="Não atribuído" size="small" color="warning" />}</TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                  <Button size="small" variant="outlined" onClick={()=>setAssignId(r.id)}>Atribuir</Button>
                  <Button size="small" variant="outlined" onClick={()=>setEditRow(r)}>Editar</Button>
                  <Button size="small" variant="outlined" color="error" onClick={()=>onDelete(r.id)}>Excluir</Button>
                  <WhatsappButton phone={r.telefone} name={r.nome} fromName={meName}/>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {!!assignId && <AssignLeadDialog open={!!assignId} onClose={()=>setAssignId(null)} leadId={assignId}/>}
      {!!editRow && <LeadEditDialog open={!!editRow} onClose={()=>setEditRow(null)} leadId={editRow.id} defaultValues={editRow}/>}
    </Paper>
  );
}
