import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Trophy, 
  ArrowLeft, 
  CheckCircle2,
  Star,
  Home,
  Eye,
  Hand,
  Ear
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "MIRA a ambos lados",
    icon: Eye,
    description: "Antes de cruzar, observa cuidadosamente a la IZQUIERDA, luego a la DERECHA y nuevamente a la IZQUIERDA.",
    tips: [
      "Verifica que no vengan vehículos",
      "Presta atención a vehículos que dan vuelta",
      "Asegúrate de hacer contacto visual con los conductores",
    ],
    correct: true,
    points: 33,
  },
  {
    id: 2,
    title: "ESCUCHA el tráfico",
    icon: Ear,
    description: "Incluso si no ves vehículos, ESCUCHA atentamente. Los motores, cláxones y sirenas te alertan de peligros.",
    tips: [
      "Quítate los audífonos al cruzar",
      "Escucha vehículos de emergencia",
      "Los vehículos eléctricos son silenciosos, ten cuidado",
    ],
    correct: true,
    points: 33,
  },
  {
    id: 3,
    title: "LEVANTA la mano",
    icon: Hand,
    description: "Levanta la mano para indicar tu intención de cruzar. Esto aumenta tu visibilidad y alerta a los conductores.",
    tips: [
      "Levanta el brazo del lado del tráfico",
      "Mantén la mano en alto mientras cruzas",
      "Haz contacto visual con los conductores",
    ],
    correct: true,
    points: 34,
  },
];

const badActions = [
  {
    text: "Cruzar corriendo sin mirar",
    reason: "Aumenta el riesgo de no ver vehículos y tropezar",
  },
  {
    text: "Cruzar entre carros estacionados",
    reason: "Los conductores no pueden verte hasta el último momento",
  },
  {
    text: "Cruzar con el celular en la mano",
    reason: "Distrae tu atención del tráfico circundante",
  },
  {
    text: "Cruzar con luz roja peatonal",
    reason: "Los vehículos tienen derecho de paso",
  },
];

const JuegoCruce = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [showingBadActions, setShowingBadActions] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

  const handleStepComplete = () => {
    const step = steps[currentStep];
    
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
      setScore(score + step.points);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!showingBadActions) {
      setShowingBadActions(true);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setScore(0);
    setShowingBadActions(false);
    setGameComplete(false);
  };

  // Game Complete Screen
  if (gameComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-8 space-y-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {[...Array(3)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-12 h-12 text-amber-500 fill-amber-500"
                  />
                ))}
              </div>
              <h2 className="text-3xl font-bold mb-2">¡Felicidades!</h2>
              <p className="text-muted-foreground">
                Ahora sabes cruzar la calle de forma segura
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-muted-foreground">Puntos Totales</div>
              </div>

              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{steps.length}/3</div>
                <div className="text-sm text-muted-foreground">Pasos Completados</div>
              </div>
            </div>

            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-2">Recuerda:</h3>
              <p className="text-sm text-muted-foreground">
                Siempre MIRA, ESCUCHA y LEVANTA la mano al cruzar. Tu seguridad es lo más importante.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleRestart} variant="outline" className="flex-1">
                Practicar de Nuevo
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

  // Bad Actions Screen
  if (showingBadActions) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto py-8">
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

          <Card>
            <CardContent className="pt-8 space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">❌ Lo que NO debes hacer</h2>
                <p className="text-muted-foreground">
                  Estas acciones ponen en riesgo tu seguridad
                </p>
              </div>

              <div className="space-y-3">
                {badActions.map((action, index) => (
                  <div 
                    key={index}
                    className="p-4 border rounded-lg bg-red-500/5 border-red-500/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        ✕
                      </div>
                      <div>
                        <p className="font-medium mb-1">{action.text}</p>
                        <p className="text-sm text-muted-foreground">{action.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleStepComplete} className="w-full" size="lg">
                Continuar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Game Steps Screen
  const step = steps[currentStep];
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
              Paso {currentStep + 1} de {steps.length}
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
              <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center">
                <IconComponent className="w-12 h-12 text-emerald-500" />
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
              <p className="text-lg text-muted-foreground">{step.description}</p>
            </div>

            {/* Tips */}
            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-bold mb-3">💡 Consejos importantes:</h3>
              <ul className="space-y-2">
                {step.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleStepComplete} 
              className="w-full" 
              size="lg"
            >
              {currentStep < steps.length - 1 ? 'Siguiente Paso' : 'Continuar'}
            </Button>

            {/* Completed Steps */}
            <div className="flex justify-center gap-2">
              {steps.map((s) => (
                <div
                  key={s.id}
                  className={`w-3 h-3 rounded-full ${
                    completedSteps.includes(s.id)
                      ? 'bg-emerald-500'
                      : currentStep + 1 === s.id
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

export default JuegoCruce;
