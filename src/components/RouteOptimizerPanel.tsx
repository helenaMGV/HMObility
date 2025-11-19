import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAnimation } from '@/contexts/AnimationContext';
import { Calculator, TrendingDown, Clock, Leaf, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ScenarioKPIs {
  tiempo_promedio_viaje: string;
  velocidad_promedio: string;
  nivel_congestion: string;
  emisiones_co2_ton_año: string;
  accidentes_año: string;
}

const RouteOptimizerPanel = () => {
  const { setScenario, setIsPlaying } = useAnimation();
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [kpis, setKpis] = useState<ScenarioKPIs | null>(null);

  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [modo, setModo] = useState('');
  const [objetivo, setObjetivo] = useState('');

  const colonias = [
    'Centro',
    'Villa de Seris',
    'San Benito',
    'Palo Verde',
    'Modelo',
    'Olivares',
    'Lomas de Madrid',
    'Villas del Real',
  ];

  const modos = [
    { value: 'camion', label: 'Camión' },
    { value: 'auto', label: 'Auto' },
    { value: 'bicicleta', label: 'Bicicleta' },
  ];

  const objetivos = [
    { value: 'tiempo', label: 'Menor tiempo', icon: Clock },
    { value: 'congestion', label: 'Menor congestión', icon: TrendingDown },
    { value: 'sustentable', label: 'Mayor sustentabilidad', icon: Leaf },
    { value: 'seguridad', label: 'Mayor seguridad', icon: AlertTriangle },
  ];

  const loadKPIs = async () => {
    try {
      const response = await fetch('/datajson/rutas_escenarios_kpis.json');
      const data = await response.json();
      setKpis(data.optimo.kpis);
    } catch (error) {
      console.error('Error loading KPIs:', error);
    }
  };

  const handleCalcular = async () => {
    setIsCalculating(true);
    setIsPlaying(false);
    
    // Simular cálculo de 2-3 segundos
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    setIsCalculating(false);
    setScenario('optimo');
    setShowResults(true);
    await loadKPIs();
  };

  const canCalculate = origen && destino && modo && objetivo;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Optimizador de Rutas
          </CardTitle>
          <CardDescription>
            Calcula el mejor escenario según tus criterios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="origen">Origen</Label>
            <Select value={origen} onValueChange={setOrigen}>
              <SelectTrigger id="origen">
                <SelectValue placeholder="Selecciona colonia" />
              </SelectTrigger>
              <SelectContent>
                {colonias.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destino">Destino</Label>
            <Select value={destino} onValueChange={setDestino}>
              <SelectTrigger id="destino">
                <SelectValue placeholder="Selecciona colonia" />
              </SelectTrigger>
              <SelectContent>
                {colonias.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modo">Modo de transporte</Label>
            <Select value={modo} onValueChange={setModo}>
              <SelectTrigger id="modo">
                <SelectValue placeholder="Selecciona modo" />
              </SelectTrigger>
              <SelectContent>
                {modos.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivo">Objetivo de optimización</Label>
            <Select value={objetivo} onValueChange={setObjetivo}>
              <SelectTrigger id="objetivo">
                <SelectValue placeholder="Selecciona objetivo" />
              </SelectTrigger>
              <SelectContent>
                {objetivos.map((obj) => {
                  const Icon = obj.icon;
                  return (
                    <SelectItem key={obj.value} value={obj.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {obj.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full"
            onClick={handleCalcular}
            disabled={!canCalculate || isCalculating}
          >
            {isCalculating ? (
              <>
                <span className="animate-spin mr-2">⚙️</span>
                Calculando escenario...
              </>
            ) : (
              'Calcular escenario óptimo'
            )}
          </Button>
        </CardContent>
      </Card>

      {showResults && kpis && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-base">Resultados de Optimización</CardTitle>
            <CardDescription>Escenario Optimizado vs Actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/50 p-2 rounded">
                <div className="text-muted-foreground">Tiempo promedio</div>
                <div className="font-semibold text-green-600">{kpis.tiempo_promedio_viaje}</div>
                <Badge variant="outline" className="text-[10px] mt-1">-29%</Badge>
              </div>
              <div className="bg-muted/50 p-2 rounded">
                <div className="text-muted-foreground">Velocidad</div>
                <div className="font-semibold text-green-600">{kpis.velocidad_promedio}</div>
                <Badge variant="outline" className="text-[10px] mt-1">+41%</Badge>
              </div>
              <div className="bg-muted/50 p-2 rounded">
                <div className="text-muted-foreground">Congestión</div>
                <div className="font-semibold text-green-600">{kpis.nivel_congestion}</div>
                <Badge variant="outline" className="text-[10px] mt-1">-35%</Badge>
              </div>
              <div className="bg-muted/50 p-2 rounded">
                <div className="text-muted-foreground">Accidentes/año</div>
                <div className="font-semibold text-green-600">{kpis.accidentes_año}</div>
                <Badge variant="outline" className="text-[10px] mt-1">-29%</Badge>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-2 border-t">
              <strong>Emisiones CO₂:</strong> {kpis.emisiones_co2_ton_año} ton/año (-29%)
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RouteOptimizerPanel;
