// admin/src/components/CardKpi.tsx
import { Card, CardContent, Typography, Box } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  title: string;
  value: number;
  color: string;
  icon: ReactNode;
}

export default function CardKpi({ title, value, color, icon }: Props) {
  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        borderRadius: 3,
        boxShadow: 4,
        height: "100%",
      }}
    >
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box color={color}>{icon}</Box>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: "bold", color }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
