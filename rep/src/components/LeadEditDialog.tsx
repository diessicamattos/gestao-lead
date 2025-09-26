// src/components/LeadEditDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const schema = z.object({
  nome: z.string().min(2),
  telefone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  origem: z.enum(["site","instagram","whatsapp","outro"]),
  status: z.enum(["novo","contatado","em_negociacao","convertido","perdido"]),
  notes: z.string().optional().or(z.literal(""))
});
type FormData = z.infer<typeof schema>;

export default function LeadEditDialog({
  open, onClose, leadId, defaultValues
}:{ open: boolean; onClose: ()=>void; leadId: string; defaultValues: any }) {

  const { register, handleSubmit, formState:{errors,isSubmitting} } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues
  });

  async function onSubmit(v: FormData) {
    await updateDoc(doc(db,"leads", leadId), { ...v, updatedAt: new Date() as any });
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar lead</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField label="Nome" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message}/>
          <TextField label="Telefone" {...register("telefone")} error={!!errors.telefone} helperText={errors.telefone?.message}/>
          <TextField label="Email" {...register("email")} error={!!errors.email} helperText={errors.email?.message}/>
          <TextField select label="Origem" {...register("origem")}>
            {["site","instagram","whatsapp","outro"].map(o=><MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextField>
          <TextField select label="Status" {...register("status")}>
            {["novo","contatado","em_negociacao","convertido","perdido"].map(s=><MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField label="Notas (campo livre)" {...register("notes")} multiline minRows={3}/>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" type="submit" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
