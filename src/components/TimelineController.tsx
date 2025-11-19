import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAnimation } from '@/contexts/AnimationContext';
import { Play, Pause, SkipBack, Gauge } from 'lucide-react';

const TimelineController = () => {
  const { isPlaying, speedMultiplier, setIsPlaying, setSpeedMultiplier, togglePlayPause } = useAnimation();

  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 4, label: '4x' },
  ];

  const handleReset = () => {
    setIsPlaying(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          Control de Animación
        </CardTitle>
        <CardDescription className="text-xs">
          Controla la reproducción y velocidad
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controles principales */}
        <div className="flex items-center gap-2">
          <Button
            variant={isPlaying ? 'default' : 'outline'}
            size="sm"
            onClick={togglePlayPause}
            className="flex-1"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pausar
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Reproducir
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
        </div>

        {/* Control de velocidad */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Velocidad</span>
            <span className="font-semibold">{speedMultiplier}x</span>
          </div>
          
          <div className="space-y-2">
            <Slider
              value={[speedOptions.findIndex((opt) => opt.value === speedMultiplier)]}
              onValueChange={(value) => {
                setSpeedMultiplier(speedOptions[value[0]].value);
              }}
              max={speedOptions.length - 1}
              step={1}
              className="w-full"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              {speedOptions.map((opt) => (
                <span key={opt.value}>{opt.label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Indicadores de estado */}
        <div className="bg-muted/50 rounded-lg p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Estado</span>
            <span className={`font-semibold ${isPlaying ? 'text-green-600' : 'text-muted-foreground'}`}>
              {isPlaying ? '🟢 Reproduciendo' : '⏸️ Pausado'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Multiplicador</span>
            <span className="font-semibold">{speedMultiplier}x</span>
          </div>
        </div>

        {/* Atajos de teclado */}
        <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 text-xs">
          <div className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
            Atajos de teclado
          </div>
          <div className="space-y-1 text-blue-800 dark:text-blue-200">
            <div className="flex items-center justify-between">
              <span>Espacio</span>
              <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                Play/Pause
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>R</span>
              <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                Reiniciar
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>+/-</span>
              <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                Velocidad
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimelineController;
