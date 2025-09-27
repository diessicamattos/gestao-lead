// rep/src/components/CardKpi.tsx
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function CardKpi({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: number | string;
  color?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box>{icon}</Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color }}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
