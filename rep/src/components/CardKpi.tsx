// src/components/CardKpi.tsx
import { Card, CardContent, Typography } from "@mui/material";

export default function CardKpi({ title, value, color = "primary.main" }:{
  title: string; value: number; color?: string;
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        <Typography variant="h3" sx={{ color }}>{value}</Typography>
      </CardContent>
    </Card>
  );
}
