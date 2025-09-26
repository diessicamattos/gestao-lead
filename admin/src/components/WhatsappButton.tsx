// src/components/WhatsappButton.tsx
import { Button } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { cleanPhone } from "../utils/phone";

export default function WhatsappButton({
  phone, name, fromName
}: { phone: string; name: string; fromName: string }) {
  const msg = `Olá ${name}, aqui é ${fromName} da empresa. Vi seu interesse e gostaria de te atender. Podemos falar?`;
  const url = `https://wa.me/${cleanPhone(phone)}?text=${encodeURIComponent(msg)}`;
  return (
    <Button
      variant="outlined" color="success" startIcon={<WhatsAppIcon />}
      onClick={() => window.open(url, "_blank")}
    >
      Iniciar chat
    </Button>
  );
}
