import { AlertCircle, DollarSign, MapPin, Gauge } from "lucide-react";

interface StreetTooltipProps {
  streetName: string;
  maxSpeed: number;
  roadType: string;
  estimatedFine: string;
}

const StreetTooltip = ({ streetName, maxSpeed, roadType, estimatedFine }: StreetTooltipProps) => {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
        <MapPin className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground">Tipo de vía</p>
          <p className="font-medium">{roadType}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg">
        <Gauge className="w-5 h-5 text-primary mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground">Velocidad máxima permitida</p>
          <p className="font-bold text-2xl text-primary">{maxSpeed} km/h</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-secondary/10 rounded-lg">
        <DollarSign className="w-5 h-5 text-secondary mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground">Multa estimada por exceso</p>
          <p className="font-bold text-lg text-secondary">{estimatedFine}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
        <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
        <div>
          <p className="text-xs text-muted-foreground">Recomendación</p>
          <p className="text-sm">Respeta siempre el límite de velocidad para evitar multas y garantizar la seguridad vial.</p>
        </div>
      </div>
    </div>
  );
};

export default StreetTooltip;
