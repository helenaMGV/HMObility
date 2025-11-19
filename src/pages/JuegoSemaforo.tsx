import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrafficCone, 
  Trophy, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  Star,
  Home
} from "lucide-react";

// Traffic light scenarios
const scenarios = [
  {
    id: 1,
    light: "verde",
    description: "El semáforo está en VERDE",
    question: "¿Qué debes hacer?",
    options: [
      { id: "a", text: "Avanzar con precaución", correct: true },
      { id: "b", text: "Acelerar rápidamente", correct: false },
      { id: "c", text: "Detenerse completamente", correct: false },
      { id: "d", text: "Tocar el claxon", correct: false },
    ],
    explanation: "Con luz verde, puedes avanzar pero SIEMPRE con precaución. Verifica que no haya peatones cruzando ni vehículos de emergencia.",
    points: 20,
  },
  {
    id: 2,
    light: "amarillo",
    description: "El semáforo está en AMARILLO",
    question: "¿Qué debes hacer?",
    options: [
      { id: "a", text: "Acelerar para pasar rápido", correct: false },
      { id: "b", text: "Prepararte para detenerte", correct: true },
      { id: "c", text: "Frenar bruscamente", correct: false },
      { id: "d", text: "Continuar a la misma velocidad", correct: false },
    ],
    explanation: "La luz amarilla indica PRECAUCIÓN. Debes prepararte para detenerte de forma segura, a menos que ya estés muy cerca de la intersección.",
    points: 20,
  },
  {
    id: 3,
    light: "rojo",
    description: "El semáforo está en ROJO",
    question: "¿Qué debes hacer?",
    options: [
      { id: "a", text: "Detenerte completamente ANTES de la línea", correct: true },
      { id: "b", text: "Avanzar si no vienen carros", correct: false },
      { id: "c", text: "Dar vuelta a la derecha", correct: false },
      { id: "d", text: "Reducir velocidad solamente", correct: false },
    ],
    explanation: "La luz roja significa ALTO TOTAL. Debes detenerte completamente ANTES de la línea de alto y esperar a que cambie a verde.",
    points: 20,
  },
  {
    id: 4,
    light: "intermitente-rojo",
    description: "El semáforo tiene luz ROJA INTERMITENTE",
    question: "¿Qué debes hacer?",
    options: [
      { id: "a", text: "Tratarlo como señal de alto", correct: true },
      { id: "b", text: "Pasar con precaución", correct: false },
      { id: "c", text: "Ignorar la señal", correct: false },
      { id: "d", text: "Esperar a que deje de parpadear", correct: false },
    ],
    explanation: "Una luz roja intermitente funciona como una señal de ALTO. Debes detenerte completamente, verificar que es seguro y luego avanzar.",
    points: 20,
  },
  {
    id: 5,
    light: "intermitente-amarillo",
    description: "El semáforo tiene luz AMARILLA INTERMITENTE",
    question: "¿Qué debes hacer?",
    options: [
      { id: "a", text: "Detenerte siempre", correct: false },
      { id: "b", text: "Reducir velocidad y avanzar con precaución", correct: true },
      { id: "c", text: "Acelerar para pasar", correct: false },
      { id: "d", text: "Esperar a que se apague", correct: false },
    ],
    explanation: "Una luz amarilla intermitente significa PRECAUCIÓN. Reduce la velocidad, verifica que es seguro y avanza con cuidado.",
    points: 20,
  },
];

const lightColors = {
  verde: "bg-emerald-500",
  amarillo: "bg-amber-500",
  rojo: "bg-red-500",
  "intermitente-rojo": "bg-red-500 animate-pulse",
  "intermitente-amarillo": "bg-amber-500 animate-pulse",
};

const JuegoSemaforo = () => {
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(30);

  const scenario = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  // Timer countdown
  useEffect(() => {
    if (showExplanation || gameComplete) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          // Time's up, move to next
          handleNext(false);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentScenario, showExplanation, gameComplete]);

  const handleOptionSelect = (optionId: string) => {
    if (showExplanation) return;
    
    setSelectedOption(optionId);
    const option = scenario.options.find(opt => opt.id === optionId);
    
    if (option?.correct) {
      setScore(score + scenario.points);
      setCorrectAnswers(correctAnswers + 1);
    }
    
    setShowExplanation(true);
  };

  const handleNext = (wasCorrect: boolean = false) => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      setTimer(30);
    } else {
      setGameComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setCorrectAnswers(0);
    setGameComplete(false);
    setTimer(30);
  };

  // Game Complete Screen
  if (gameComplete) {
    const finalPercentage = (correctAnswers / scenarios.length) * 100;
    const stars = finalPercentage >= 80 ? 3 : finalPercentage >= 60 ? 2 : 1;

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardHeader className="text-center">
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
            <CardTitle className="text-3xl">¡Juego Completado!</CardTitle>
            <CardDescription>Resultados del Juego del Semáforo</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{score}</div>
                <div className="text-sm text-muted-foreground">Puntos</div>
              </div>

              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{correctAnswers}/{scenarios.length}</div>
                <div className="text-sm text-muted-foreground">Correctas</div>
              </div>

              <div className="text-center p-4 bg-gradient-card rounded-lg">
                <Star className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{finalPercentage.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Precisión</div>
              </div>
            </div>

            {/* Feedback */}
            <div className="text-center p-6 bg-muted/50 rounded-lg">
              {finalPercentage >= 80 ? (
                <p className="text-lg font-medium text-emerald-600 dark:text-emerald-400">
                  ¡Excelente! Dominas las señales del semáforo 🎉
                </p>
              ) : finalPercentage >= 60 ? (
                <p className="text-lg font-medium text-amber-600 dark:text-amber-400">
                  ¡Bien hecho! Con práctica serás experto 👍
                </p>
              ) : (
                <p className="text-lg font-medium text-blue-600 dark:text-blue-400">
                  Sigue practicando para mejorar 💪
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button onClick={handleRestart} variant="outline" className="flex-1 gap-2">
                Jugar de Nuevo
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

  // Game Screen
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

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-2">
              <Trophy className="w-4 h-4" />
              {score} pts
            </Badge>
            <Badge variant={timer <= 10 ? "destructive" : "outline"}>
              {timer}s
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              Pregunta {currentScenario + 1} de {scenarios.length}
            </span>
            <span className="font-medium">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Traffic Light Visualization */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              {/* Traffic Light */}
              <div className="bg-gray-800 rounded-2xl p-4 w-32">
                <div className="space-y-3">
                  {["rojo", "amarillo", "verde"].map((color) => (
                    <div
                      key={color}
                      className={`w-24 h-24 rounded-full transition-all ${
                        scenario.light.includes(color)
                          ? lightColors[scenario.light as keyof typeof lightColors]
                          : 'bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Scenario Description */}
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{scenario.description}</h2>
                <p className="text-lg text-muted-foreground">{scenario.question}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Options */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-3">
              {scenario.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const showCorrect = showExplanation && option.correct;
                const showIncorrect = showExplanation && isSelected && !option.correct;

                return (
                  <Button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={showExplanation}
                    variant={showCorrect ? "default" : showIncorrect ? "destructive" : "outline"}
                    className={`h-auto py-4 px-6 justify-start text-left ${
                      isSelected && !showExplanation ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="font-bold text-lg">{option.id.toUpperCase()}</span>
                      <span className="flex-1">{option.text}</span>
                      {showCorrect && <CheckCircle2 className="w-5 h-5" />}
                      {showIncorrect && <XCircle className="w-5 h-5" />}
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6 p-4 bg-muted rounded-lg animate-fade-in">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <TrafficCone className="w-5 h-5 text-amber-500" />
                  Explicación
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{scenario.explanation}</p>
                
                <Button onClick={() => handleNext()} className="w-full">
                  {currentScenario < scenarios.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JuegoSemaforo;
