import { IconButton, Tooltip } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function WhatsappButton({
  phone,
  name,
}: {
  phone: string;
  name?: string;
}) {
  if (!phone) return null;

  const url = `https://wa.me/55${phone.replace(/\D/g, "")}?text=Olá%20${encodeURIComponent(
    name || "tudo bem?"
  )}`;

  return (
    <Tooltip title="Iniciar conversa no WhatsApp">
      <IconButton
        component="a"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        color="success"
      >
        <WhatsAppIcon />
      </IconButton>
    </Tooltip>
  );
}
