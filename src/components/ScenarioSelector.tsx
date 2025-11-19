import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnimation } from '@/contexts/AnimationContext';
import { MapPin, Zap, Calendar, Check } from 'lucide-react';

const ScenarioSelector = () => {
  const { scenario, setScenario } = useAnimation();

  const scenarios = [
    {
      id: 'actual' as const,
      title: 'Red Actual',
      description: 'Sistema de transporte actual de Hermosillo',
      icon: MapPin,
      color: 'from-blue-500 to-blue-600',
      stats: '5 rutas • 8 vehículos',
    },
    {
      id: 'optimo' as const,
      title: 'Escenario Optimizado',
      description: 'Rutas optimizadas con IA para reducir tiempos',
      icon: Zap,
      color: 'from-green-500 to-green-600',
      stats: '6 rutas • -29% tiempo',
    },
    {
      id: 'eventos' as const,
      title: 'Eventos Especiales',
      description: 'Rutas ajustadas para eventos masivos',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      stats: '5 rutas • 3 desvíos',
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold mb-2">Seleccionar Escenario</h2>
        <p className="text-sm text-muted-foreground">
          Explora diferentes configuraciones de la red de movilidad
        </p>
      </div>

      <div className="space-y-3">
        {scenarios.map((s) => {
          const Icon = s.icon;
          const isActive = scenario === s.id;

          return (
            <Card
              key={s.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isActive ? 'ring-2 ring-primary shadow-lg' : ''
              }`}
              onClick={() => setScenario(s.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${s.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {s.title}
                        {isActive && <Check className="w-4 h-4 text-primary" />}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {s.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xs text-muted-foreground">
                  {s.stats}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-muted/50 rounded-lg p-3 text-xs">
        <p className="text-muted-foreground">
          <strong>Tip:</strong> Usa el panel de optimización para calcular nuevas rutas
          basadas en criterios específicos.
        </p>
      </div>
    </div>
  );
};

export default ScenarioSelector;
