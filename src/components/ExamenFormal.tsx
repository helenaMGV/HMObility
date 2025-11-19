import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, FileText, AlertCircle, RotateCcw, Clock, Sparkles, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

interface Pregunta {
  id: number;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number;
  articulo_id: string;
  tema: string;
  explicacion: string;
}

interface RespuestaUsuario {
  pregunta_id: number;
  respuesta: number;
  correcta: boolean;
  tema: string;
}

const PREGUNTAS_EXAMEN = 10; // Número de preguntas en el examen
const PUNTAJE_APROBATORIO = 8; // 80% para aprobar

export function ExamenFormal() {
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [preguntasExamen, setPreguntasExamen] = useState<Pregunta[]>([]);
  const [loading, setLoading] = useState(true);
  const [examenIniciado, setExamenIniciado] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [respuestasUsuario, setRespuestasUsuario] = useState<RespuestaUsuario[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [examenFinalizado, setExamenFinalizado] = useState(false);
  const [tiempoInicio, setTiempoInicio] = useState<number>(0);

  useEffect(() => {
    fetch("/src/data/examen_preguntas.json")
      .then(res => res.json())
      .then(data => {
        setPreguntas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando preguntas:", err);
        setLoading(false);
      });
  }, []);

  const iniciarExamen = () => {
    // Seleccionar preguntas aleatorias
    const shuffled = [...preguntas].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, PREGUNTAS_EXAMEN);
    setPreguntasExamen(selected);
    setExamenIniciado(true);
    setTiempoInicio(Date.now());
    setCurrentIndex(0);
    setRespuestasUsuario([]);
    setSelectedAnswer(null);
    setExamenFinalizado(false);
  };

  const handleRespuesta = (respuestaIndex: number) => {
    if (selectedAnswer !== null) return; // Ya respondió

    setSelectedAnswer(respuestaIndex);
    const preguntaActual = preguntasExamen[currentIndex];
    const correcta = respuestaIndex === preguntaActual.respuesta_correcta;

    const nuevaRespuesta: RespuestaUsuario = {
      pregunta_id: preguntaActual.id,
      respuesta: respuestaIndex,
      correcta,
      tema: preguntaActual.tema
    };

    setRespuestasUsuario([...respuestasUsuario, nuevaRespuesta]);
  };

  const siguientePregunta = () => {
    if (currentIndex < preguntasExamen.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
    } else {
      setExamenFinalizado(true);
      const tiempoTotal = Math.floor((Date.now() - tiempoInicio) / 1000);
      toast.success("Examen completado", {
        description: `Tiempo: ${Math.floor(tiempoTotal / 60)}:${(tiempoTotal % 60).toString().padStart(2, '0')}`
      });
    }
  };

  const reiniciar = () => {
    setExamenIniciado(false);
    setExamenFinalizado(false);
    setCurrentIndex(0);
    setRespuestasUsuario([]);
    setSelectedAnswer(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Cargando examen...</div>
      </div>
    );
  }

  // Pantalla inicial
  if (!examenIniciado) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-elegant animate-in fade-in duration-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <div>
                <CardTitle className="text-2xl">Examen Teórico de Tránsito</CardTitle>
                <CardDescription>Evaluación formal de conocimientos viales</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Instrucciones:</h3>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>El examen consta de <strong>{PREGUNTAS_EXAMEN} preguntas</strong> seleccionadas aleatoriamente</li>
                <li>Cada pregunta tiene <strong>4 opciones</strong> de respuesta</li>
                <li>Para aprobar necesitas <strong>mínimo {PUNTAJE_APROBATORIO} respuestas correctas</strong> ({(PUNTAJE_APROBATORIO / PREGUNTAS_EXAMEN * 100)}%)</li>
                <li>Una vez que respondas, no podrás cambiar tu respuesta</li>
                <li>Al finalizar verás tu resultado y áreas de mejora</li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{PREGUNTAS_EXAMEN}</p>
                <p className="text-xs text-muted-foreground">Preguntas</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{PUNTAJE_APROBATORIO}/{PREGUNTAS_EXAMEN}</p>
                <p className="text-xs text-muted-foreground">Para aprobar</p>
              </div>
            </div>

            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger asChild>
            <Button
              onClick={iniciarExamen}
              className="w-full gradient-primary text-white hover:shadow-lg transition-all"
              size="lg"
              disabled={preguntas.length < PREGUNTAS_EXAMEN}
            >
              <FileText className="w-4 h-4 mr-2" />
              Iniciar Examen
            </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comenzar evaluación de {PREGUNTAS_EXAMEN} preguntas aleatorias</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Resultados finales
  if (examenFinalizado) {
    const correctas = respuestasUsuario.filter(r => r.correcta).length;
    const aprobado = correctas >= PUNTAJE_APROBATORIO;
    const porcentaje = (correctas / PREGUNTAS_EXAMEN) * 100;
    const tiempoTotal = Math.floor((Date.now() - tiempoInicio) / 1000);

    // Análisis por tema
    const temaAnalisis = respuestasUsuario.reduce((acc, r) => {
      if (!acc[r.tema]) {
        acc[r.tema] = { total: 0, correctas: 0 };
      }
      acc[r.tema].total++;
      if (r.correcta) acc[r.tema].correctas++;
      return acc;
    }, {} as Record<string, { total: number; correctas: number }>);

    const temasDebiles = Object.entries(temaAnalisis)
      .filter(([_, stats]) => stats.correctas / stats.total < 0.7)
      .map(([tema]) => tema);

    return (
      <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-700">
        <Card className="shadow-elegant border-2">
          <CardHeader className="text-center">
            <div className={`text-6xl mb-4 animate-bounce`}>
              {aprobado ? "🎉" : "📚"}
            </div>
            <CardTitle className={`text-3xl font-bold flex items-center gap-2 justify-center ${aprobado ? 'text-green-600' : 'text-orange-600'}`}>
              {aprobado ? "¡Aprobado!" : "No Aprobado"}
              {correctas === PREGUNTAS_EXAMEN && (
                <Award className="h-8 w-8 text-yellow-500 animate-pulse" />
              )}
            </CardTitle>
            <CardDescription className="text-lg">
              {correctas === PREGUNTAS_EXAMEN 
                ? "¡Perfecto! Examen 100% correcto 🌟" 
                : aprobado 
                  ? "Felicidades, has demostrado buenos conocimientos de tránsito" 
                  : "Necesitas estudiar más el Reglamento de Tránsito"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resultado principal */}
            <div className={`p-8 rounded-lg text-center ${aprobado ? 'bg-green-50' : 'bg-orange-50'}`}>
              <p className="text-muted-foreground mb-2">Calificación Final</p>
              <p className="text-6xl font-bold text-primary mb-2">{correctas}/{PREGUNTAS_EXAMEN}</p>
              <p className="text-xl font-semibold">{porcentaje.toFixed(0)}%</p>
              <Badge className={`mt-2 ${aprobado ? 'bg-green-600' : 'bg-orange-600'}`}>
                {aprobado ? 'APROBADO' : 'NO APROBADO'}
              </Badge>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{correctas}</p>
                <p className="text-xs text-muted-foreground">Correctas</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{PREGUNTAS_EXAMEN - correctas}</p>
                <p className="text-xs text-muted-foreground">Incorrectas</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{Math.floor(tiempoTotal / 60)}:{(tiempoTotal % 60).toString().padStart(2, '0')}</p>
                <p className="text-xs text-muted-foreground">Tiempo</p>
              </div>
            </div>

            {/* Análisis por tema */}
            {temasDebiles.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-2">Temas a Reforzar:</h3>
                    <div className="flex flex-wrap gap-2">
                      {temasDebiles.map(tema => (
                        <Badge key={tema} variant="outline" className="bg-yellow-100 text-yellow-800">
                          {tema.charAt(0).toUpperCase() + tema.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Detalle por tema */}
            <div>
              <h3 className="font-semibold mb-3">Desempeño por Tema:</h3>
              <div className="space-y-2">
                {Object.entries(temaAnalisis).map(([tema, stats]) => {
                  const pct = (stats.correctas / stats.total) * 100;
                  return (
                    <div key={tema} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{tema}</span>
                        <span className="font-semibold">{stats.correctas}/{stats.total} ({pct.toFixed(0)}%)</span>
                      </div>
                      <Progress value={pct} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Botón reiniciar */}
            <Button
              onClick={reiniciar}
              className="w-full"
              variant="outline"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Realizar Nuevo Examen
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Examen en progreso
  const pregunta = preguntasExamen[currentIndex];
  const progress = ((currentIndex + 1) / preguntasExamen.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline">
              Pregunta {currentIndex + 1} de {preguntasExamen.length}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {pregunta.articulo_id}
            </Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-xl">{pregunta.pregunta}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Opciones */}
          <div className="space-y-2">
            {pregunta.opciones.map((opcion, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === pregunta.respuesta_correcta;
              const showResult = selectedAnswer !== null;

              let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ";
              if (!showResult) {
                buttonClass += "hover:border-primary hover:bg-primary/5 hover:shadow-md hover:-translate-y-0.5 cursor-pointer";
              } else if (isSelected && isCorrect) {
                buttonClass += "border-green-500 bg-green-50 text-green-900 shadow-md";
              } else if (isSelected && !isCorrect) {
                buttonClass += "border-red-500 bg-red-50 text-red-900 shadow-md";
              } else if (isCorrect) {
                buttonClass += "border-green-500 bg-green-50 text-green-900 shadow-md";
              } else {
                buttonClass += "border-gray-200 opacity-50";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleRespuesta(index)}
                  disabled={selectedAnswer !== null}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <div className="flex-1">{opcion}</div>
                    {showResult && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explicación */}
          {selectedAnswer !== null && (
            <div className={`p-4 rounded-lg ${respuestasUsuario[respuestasUsuario.length - 1]?.correcta ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Explicación:
              </h4>
              <p className="text-sm">{pregunta.explicacion}</p>
            </div>
          )}

          {/* Botón siguiente */}
          {selectedAnswer !== null && (
            <Button
              onClick={siguientePregunta}
              className="w-full gradient-primary text-white"
              size="lg"
            >
              {currentIndex < preguntasExamen.length - 1 ? "Siguiente Pregunta" : "Ver Resultados"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
