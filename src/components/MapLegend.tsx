import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const MapLegend = () => {
  const legendItems = [
    { label: "Alta (≥70 km/h)", color: "bg-primary", description: "Bulevares y vías rápidas" },
    { label: "Media (50-69 km/h)", color: "bg-secondary", description: "Avenidas principales" },
    { label: "Baja (<50 km/h)", color: "bg-accent", description: "Calles residenciales" },
  ];

  return (
    <Card className="shadow-elegant sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="w-5 h-5 text-primary" />
          Leyenda de Velocidades
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {legendItems.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={`${item.color} w-8 h-8 rounded-full shadow-md`} />
              <div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Importante
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Las velocidades mostradas son límites máximos. Conduce siempre de acuerdo a las condiciones del tráfico y clima.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapLegend;
