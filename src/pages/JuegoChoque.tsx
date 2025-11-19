import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Car, 
  Trophy, 
  ArrowLeft, 
  CheckCircle2,
  Star,
  Home,
  ShieldAlert,
  Phone,
  Camera,
  FileText,
  AlertTriangle
} from "lucide-react";

const protocol = [
  {
    id: 1,
    title: "Seguridad Primero",
    icon: ShieldAlert,
    description: "Lo primero es asegurar el lugar y prevenir más daños",
    actions: [
      { text: "Enciende las luces intermitentes", required: true },
      { text: "Coloca triángulos de seguridad", required: true },
      { text: "Mueve el vehículo si es posible y seguro", required: false },
      { text: "Verifica que todos estén a salvo", required: true },
    ],
    tips: "Si hay lesionados, NO los muevas a menos que haya peligro inmediato (incendio, explosión).",
    points: 25,
  },
  {
    id: 2,
    title: "Llamadas de Emergencia",
    icon: Phone,
    description: "Contacta a los servicios de emergencia necesarios",
    actions: [
      { text: "Llama al 911 si hay heridos", required: true },
      { text: "Reporta a tu aseguradora", required: true },
      { text: "Contacta a un médico si es necesario", required: false },
      { text: "Llama a grúa si el vehículo no funciona", required: false },
    ],
    tips: "Mantén la calma al hablar con emergencias. Proporciona tu ubicación exacta y describe los daños.",
    points: 25,
  },
  {
    id: 3,
    title: "Documentación del Accidente",
    icon: Camera,
    description: "Recopila evidencia del incidente",
    actions: [
      { text: "Toma fotos de los daños a ambos vehículos", required: true },
      { text: "Fotografía placas, tarjetas de circulación y licencias", required: true },
      { text: "Captura la escena completa del accidente", required: true },
      { text: "Graba videos si es posible", required: false },
    ],
    tips: "Toma fotos desde varios ángulos. Incluye señales de tránsito, condiciones climáticas y marcas en el pavimento.",
    points: 25,
  },
  {
    id: 4,
    title: "Intercambio de Información",
    icon: FileText,
    description: "Obtén y proporciona los datos necesarios",
    actions: [
      { text: "Intercambia nombres y números de teléfono", required: true },
      { text: "Intercambia números de póliza de seguro", required: true },
      { text: "Anota placas y marcas de vehículos", required: true },
      { text: "Obtén datos de testigos si los hay", required: false },
    ],
    tips: "Sé cortés pero NO admitas culpabilidad. Solo intercambia información factual.",
    points: 25,
  },
];

const JuegoChoque = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedActions, setCompletedActions] = useState<Record<number, string[]>>({});
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const step = protocol[currentStep];
  const progress = ((currentStep + 1) / protocol.length) * 100;
  const stepActions = completedActions[step.id] || [];
  const requiredActions = step.actions.filter(a => a.required);
  const requiredCompleted = requiredActions.every(a => stepActions.includes(a.text));

  const handleActionToggle = (actionText: string) => {
    const current = completedActions[step.id] || [];
    const updated = current.includes(actionText)
      ? current.filter(t => t !== actionText)
      : [...current, actionText];
    
    setCompletedActions({
      ...completedActions,
      [step.id]: updated,
    });
  };

  const handleContinue = () => {
    // Award points for this step
    if (requiredCompleted && !gameComplete) {
      setScore(score + step.points);
    }

    if (currentStep < protocol.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedActions({});
    setScore(0);
    setGameComplete(false);
  };

  // Calculate total completion
  const totalActions = protocol.reduce((sum, s) => sum + s.actions.length, 0);
  const completedTotal = Object.values(completedActions).reduce(
    (sum, actions) => sum + actions.length,
    0
  );
  const completionPercentage = (completedTotal / totalActions) * 100;

  // Game Complete Screen
  if (gameComplete) {
    const stars = completionPercentage >= 80 ? 3 : completionPercentage >= 60 ? 2 : 1;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-8 space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-12 h-12 ${
                      i < stars ? 'text-amber-500 fill-amber-500' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <h2 className="text-3xl font-bold mb-2">¡Protocolo Completado!</h2>
              <p className="text-muted-foreground">
                Ahora sabes cómo actuar después de un accidente
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-muted-foreground">Puntos</div>
              </div>

              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{protocol.length}/4</div>
                <div className="text-sm text-muted-foreground">Pasos</div>
              </div>

              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{completionPercentage.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Completado</div>
              </div>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Recuerda:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Mantén la calma en todo momento</li>
                <li>• La seguridad es lo primero</li>
                <li>• Documenta todo lo posible</li>
                <li>• NO admitas culpabilidad</li>
                <li>• Contacta a tu aseguradora lo antes posible</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleRestart} variant="outline" className="flex-1">
                Repasar Protocolo
              </Button>
              <Button onClick={() => navigate("/juego")} className="flex-1 gap-2">
                <Home className="w-4 h-4" />
                Volver al Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Game Steps Screen
  const IconComponent = step.icon;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/juego")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Button>

          <Badge variant="secondary" className="gap-2">
            <Trophy className="w-4 h-4" />
            {score} pts
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Paso {currentStep + 1} de {protocol.length}
            </span>
            <span className="font-medium">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Card */}
        <Card>
          <CardContent className="pt-8 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center">
                <IconComponent className="w-12 h-12 text-red-500" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
              <p className="text-lg text-muted-foreground">{step.description}</p>
            </div>

            {/* Actions Checklist */}
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-muted-foreground uppercase">
                Acciones a Realizar:
              </h3>
              {step.actions.map((action, index) => {
                const isCompleted = stepActions.includes(action.text);
                
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <Checkbox
                      checked={isCompleted}
                      onCheckedChange={() => handleActionToggle(action.text)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${isCompleted ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                        {action.text}
                      </p>
                      {action.required && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Requerido
                        </Badge>
                      )}
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Tips */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                Consejo Importante:
              </h3>
              <p className="text-sm text-muted-foreground">{step.tips}</p>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleContinue} 
              disabled={!requiredCompleted}
              className="w-full" 
              size="lg"
            >
              {!requiredCompleted && 'Completa las acciones requeridas'}
              {requiredCompleted && currentStep < protocol.length - 1 && 'Siguiente Paso'}
              {requiredCompleted && currentStep === protocol.length - 1 && 'Ver Resultados'}
            </Button>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2">
              {protocol.map((s, idx) => (
                <div
                  key={s.id}
                  className={`w-3 h-3 rounded-full ${
                    idx < currentStep
                      ? 'bg-emerald-500'
                      : idx === currentStep
                      ? 'bg-primary'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JuegoChoque;
