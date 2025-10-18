import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MapLegend from "./MapLegend";
import StreetTooltip from "./StreetTooltip";
import { Map, Navigation } from "lucide-react";

interface StreetData {
  name: string;
  maxSpeed: number;
  roadType: string;
  zone: string;
  estimatedFine: string;
}

const streets: StreetData[] = [
  { name: "Blvd. Luis Encinas", maxSpeed: 50, roadType: "Bulevar principal", zone: "Centro", estimatedFine: "$1,000 - $2,000" },
  { name: "Blvd. Solidaridad", maxSpeed: 50, roadType: "Bulevar", zone: "Norte", estimatedFine: "$1,000 - $2,000" },
  { name: "Av. Cultura", maxSpeed: 30, roadType: "Avenida", zone: "Centro", estimatedFine: "$1,000 - $2,000" },
  { name: "Blvd. Paseo Río Sonora", maxSpeed: 50, roadType: "Bulevar periférico", zone: "Sur", estimatedFine: "$1,000 - $2,000" },
  { name: "Calle Morelia", maxSpeed: 30, roadType: "Calle residencial", zone: "Centro", estimatedFine: "$1,000 - $2,000" },
  { name: "Av. Rosales", maxSpeed: 30, roadType: "Avenida secundaria", zone: "Centro", estimatedFine: "$1,000 - $2,000" },
  { name: "Carretera", maxSpeed: 110, roadType: "General", zone: "Hermosillo y Afueras", estimatedFine: "$1,000 - $2,000" },
  { name: "Zonas Escolares", maxSpeed: 20, roadType: "General", zone: "Hermosillo", estimatedFine: "$1,000 - $2,000" },
];

const SpeedMap = () => {
  const [selectedStreet, setSelectedStreet] = useState<StreetData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getSpeedCategory = (speed: number) => {
    if (speed >= 50) return "alta";
    if (speed >= 30) return "media";
    return "baja";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "alta": return "bg-primary";
      case "media": return "bg-secondary";
      case "baja": return "bg-accent";
      default: return "bg-muted";
    }
  };

  const handleStreetClick = (street: StreetData) => {
    setSelectedStreet(street);
    setIsDialogOpen(true);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Map className="w-10 h-10 text-primary" />
              <h2 className="text-4xl md:text-5xl font-bold text-gradient">
                Mapa de Velocidades
              </h2>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Consulta las velocidades máximas permitidas en las principales vías de Hermosillo
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 animate-slide-up">
            {/* Map Visualization */}
            <div className="lg:col-span-2">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary" />
                    Principales Vialidades
                  </CardTitle>
                  <CardDescription>
                    Haz clic en una calle para ver más detalles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {streets.map((street, index) => {
                      const category = getSpeedCategory(street.maxSpeed);
                      const colorClass = getCategoryColor(category);
                      
                      return (
                        <div
                          key={index}
                          onClick={() => handleStreetClick(street)}
                          className="p-4 rounded-lg border border-border hover:border-primary/50 transition-smooth cursor-pointer group bg-card hover:shadow-card"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                                {street.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {street.roadType} • {street.zone}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`${colorClass} text-white px-4 py-2 rounded-full font-bold text-sm shadow-md`}>
                                {street.maxSpeed} km/h
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Legend */}
            <div>
              <MapLegend />
            </div>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedStreet && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-primary">
                  {selectedStreet.name}
                </DialogTitle>
                <DialogDescription>
                  Información detallada de la vialidad
                </DialogDescription>
              </DialogHeader>
              <StreetTooltip
                streetName={selectedStreet.name}
                maxSpeed={selectedStreet.maxSpeed}
                roadType={selectedStreet.roadType}
                estimatedFine={selectedStreet.estimatedFine}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default SpeedMap;
