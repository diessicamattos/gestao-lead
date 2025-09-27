import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Paper,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WhatsappButton from "./WhatsappButton";
import { Lead } from "../hooks/useLeads";

export default function LeadTableMy({
  leads,
  onSelect,
}: {
  leads: Lead[];
  onSelect: (lead: Lead) => void;
}) {
  return (
    <Paper sx={{ width: "100%", overflowX: "auto" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Telefone</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads.map((l) => (
            <TableRow key={l.id} hover>
              <TableCell>
                <Typography fontWeight="bold">{l.nome}</Typography>
              </TableCell>
              <TableCell>{l.telefone}</TableCell>
              <TableCell>{l.status || "novo"}</TableCell>
              <TableCell>
                {/* WhatsApp */}
                <WhatsappButton phone={l.telefone} name={l.nome} />

                {/* Ver detalhes */}
                <IconButton onClick={() => onSelect(l)} color="primary">
                  <VisibilityIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
