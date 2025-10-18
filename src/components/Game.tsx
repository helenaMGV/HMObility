import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Trophy, Star, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Scenario {
  id: number;
  situation: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    situation: "Estás conduciendo por Blvd. Luis Encinas en hora pico",
    question: "¿Cuál es la velocidad máxima permitida?",
    options: ["60 km/h", "70 km/h", "80 km/h", "90 km/h"],
    correctAnswer: 2,
    explanation: "En bulevares principales como Luis Encinas, el límite es 80 km/h. Respetar este límite reduce accidentes.",
    points: 10,
  },
  {
    id: 2,
    situation: "Recibes una llamada importante mientras conduces",
    question: "¿Qué debes hacer?",
    options: [
      "Contestar rápidamente",
      "Usar el altavoz del celular",
      "Orillarte de forma segura antes de contestar",
      "Enviar un mensaje de texto"
    ],
    correctAnswer: 2,
    explanation: "Usar el celular mientras conduces está prohibido y puede costarte $1,000 de multa. Lo correcto es orillarte de forma segura.",
    points: 15,
  },
  {
    id: 3,
    situation: "El semáforo cambia a amarillo cuando te aproximas",
    question: "¿Cuál es la acción correcta?",
    options: [
      "Acelerar para pasar rápido",
      "Frenar suavemente si es seguro",
      "Tocar el claxon",
      "Mantener la misma velocidad"
    ],
    correctAnswer: 1,
    explanation: "La luz amarilla indica prepararse para detenerse. Pasar en rojo puede costarte $1,500 de multa.",
    points: 10,
  },
  {
    id: 4,
    situation: "Viajas con tu familia en el automóvil",
    question: "¿Quiénes deben usar cinturón de seguridad?",
    options: [
      "Solo el conductor",
      "Conductor y copiloto",
      "Todos excepto niños",
      "Todos los ocupantes"
    ],
    correctAnswer: 3,
    explanation: "Todos los ocupantes deben usar cinturón. No hacerlo resulta en multa de $800 y pone en riesgo vidas.",
    points: 10,
  },
  {
    id: 5,
    situation: "Estás en una fiesta y has consumido alcohol",
    question: "¿Cuándo puedes conducir de forma segura?",
    options: [
      "Después de tomar café",
      "Si te sientes bien",
      "Nunca, busca transporte alternativo",
      "Después de 1 hora"
    ],
    correctAnswer: 2,
    explanation: "Conducir bajo influencia del alcohol es gravísimo: $3,000-$5,000 de multa más posible arresto. ¡Nunca manejes ebrio!",
    points: 20,
  },
];

const Game = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const isCorrect = answerIndex === scenarios[currentScenario].correctAnswer;
    
    if (isCorrect) {
      const points = scenarios[currentScenario].points;
      setScore(score + points);
      toast.success(`¡Correcto! +${points} puntos`, {
        description: "Excelente conocimiento vial",
      });
    } else {
      toast.error("Respuesta incorrecta", {
        description: "Revisa la explicación para aprender",
      });
    }
  };

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setGameFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenario(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setGameFinished(false);
  };

  const progress = ((currentScenario + 1) / scenarios.length) * 100;
  const maxScore = scenarios.reduce((sum, s) => sum + s.points, 0);

  if (gameFinished) {
    const percentage = (score / maxScore) * 100;
    let medal = "🥉";
    let message = "¡Buen intento! Sigue aprendiendo.";
    
    if (percentage >= 90) {
      medal = "🏆";
      message = "¡Excelente! Eres un experto en educación vial.";
    } else if (percentage >= 70) {
      medal = "🥇";
      message = "¡Muy bien! Tienes buenos conocimientos viales.";
    } else if (percentage >= 50) {
      medal = "🥈";
      message = "¡Bien hecho! Continúa mejorando.";
    }

    return (
      <div className="max-w-2xl mx-auto animate-scale-in">
        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">{medal}</div>
            <CardTitle className="text-3xl text-gradient">¡Juego Completado!</CardTitle>
            <CardDescription className="text-lg">{message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-8 bg-gradient-card rounded-lg">
              <p className="text-muted-foreground mb-2">Puntaje Final</p>
              <p className="text-5xl font-bold text-primary">{score}</p>
              <p className="text-muted-foreground">de {maxScore} puntos</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{percentage.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground">Precisión</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <Star className="w-6 h-6 text-secondary mx-auto mb-2" />
                <p className="text-2xl font-bold">{scenarios.length}</p>
                <p className="text-xs text-muted-foreground">Escenarios</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold">
                  {scenarios.filter((s, i) => selectedAnswer === s.correctAnswer).length}
                </p>
                <p className="text-xs text-muted-foreground">Correctas</p>
              </div>
            </div>

            <Button
              onClick={handleRestart}
              className="w-full gradient-primary text-white hover:opacity-90"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Jugar de Nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scenario = scenarios[currentScenario];
  const isCorrect = selectedAnswer === scenario.correctAnswer;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Progress */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              Escenario {currentScenario + 1} de {scenarios.length}
            </span>
            <span className="text-sm font-bold text-primary">
              {score} puntos
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Scenario */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-2xl">{scenario.situation}</CardTitle>
          <CardDescription className="text-lg">{scenario.question}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {scenario.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showFeedback}
              className={`w-full p-4 text-left rounded-lg border-2 transition-smooth ${
                showFeedback
                  ? index === scenario.correctAnswer
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : selectedAnswer === index
                    ? "border-red-500 bg-red-50 dark:bg-red-950"
                    : "border-border opacity-50"
                  : selectedAnswer === index
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-3">
                {showFeedback && index === scenario.correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
                {showFeedback && selectedAnswer === index && index !== scenario.correctAnswer && (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}

          {showFeedback && (
            <div
              className={`p-4 rounded-lg animate-slide-up ${
                isCorrect
                  ? "bg-green-50 dark:bg-green-950 border-2 border-green-500"
                  : "bg-red-50 dark:bg-red-950 border-2 border-red-500"
              }`}
            >
              <p className="font-medium mb-2 flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 dark:text-green-300">¡Correcto!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-700 dark:text-red-300">Incorrecto</span>
                  </>
                )}
              </p>
              <p className="text-sm text-foreground/80">{scenario.explanation}</p>
            </div>
          )}

          {showFeedback && (
            <Button
              onClick={handleNext}
              className="w-full gradient-primary text-white"
              size="lg"
            >
              {currentScenario < scenarios.length - 1 ? "Siguiente Escenario" : "Ver Resultados"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Game;
