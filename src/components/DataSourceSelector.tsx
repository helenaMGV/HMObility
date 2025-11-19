import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Database, Map as MapIcon } from 'lucide-react';

interface DataSourceSelectorProps {
  useRealData: boolean;
  onToggle: (value: boolean) => void;
}

const DataSourceSelector = ({ useRealData, onToggle }: DataSourceSelectorProps) => {
  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm">Fuente de Datos</CardTitle>
          </div>
          <Badge variant={useRealData ? "default" : "secondary"} className="text-xs">
            {useRealData ? "OSM Real" : "Simulado"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapIcon className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="data-source" className="text-sm cursor-pointer">
              Usar datos reales de OpenStreetMap
            </Label>
          </div>
          <Switch
            id="data-source"
            checked={useRealData}
            onCheckedChange={onToggle}
          />
        </div>
        
        <CardDescription className="text-xs">
          {useRealData ? (
            <>
              <strong>Activo:</strong> Rutas basadas en calles reales de Hermosillo (1,018 calles, 112 semáforos, 233 cruces)
            </>
          ) : (
            <>
              <strong>Simulado:</strong> Rutas ficticias para demostración de funcionalidad
            </>
          )}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default DataSourceSelector;
