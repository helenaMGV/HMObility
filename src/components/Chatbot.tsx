import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqData: { [key: string]: string } = {
  "multas": "Las multas de tránsito varían según la infracción. Por ejemplo: exceso de velocidad ($1,200-$3,000), uso de celular ($1,000), no usar cinturón ($800). Consulta la tabla completa en la página principal.",
  "velocidad": "Las velocidades máximas en Hermosillo son: Bulevares principales (70-80 km/h), Avenidas (50-60 km/h), Calles residenciales (40 km/h). Siempre respeta los señalamientos.",
  "pago": "Puedes pagar tus multas en línea, en oficinas municipales o en tiendas autorizadas. El pago inmediato puede tener descuentos del 20-50%.",
  "puntos": "El sistema de puntos penaliza infracciones graves. Acumular muchos puntos puede resultar en suspensión de licencia. Conducir responsablemente evita sanciones.",
  "licencia": "Para obtener tu licencia necesitas: identificación oficial, comprobante de domicilio, examen teórico y práctico. Visita el módulo de tránsito municipal.",
  "seguro": "El seguro de auto es obligatorio en Sonora. Circular sin seguro puede resultar en multa de hasta $2,000 y retención del vehículo.",
};

const Chatbot = ({ isOpen, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy el asistente de HMObility. ¿En qué puedo ayudarte? Pregúntame sobre multas, velocidades, pagos, licencias o seguros.",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simple keyword matching for FAQ
    setTimeout(() => {
      let response = "Interesante pregunta. Te recomiendo consultar la tabla de multas o el mapa de velocidades en la página principal para más información detallada.";
      
      const lowerInput = inputValue.toLowerCase();
      for (const [keyword, answer] of Object.entries(faqData)) {
        if (lowerInput.includes(keyword)) {
          response = answer;
          break;
        }
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: response,
        isUser: false,
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInputValue("");
  };

  const quickQuestions = [
    "¿Cuánto cuesta una multa?",
    "Velocidades permitidas",
    "¿Cómo pagar multas?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
      <Card className="w-96 h-[600px] shadow-elegant flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-accent text-accent-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-bold">Asistente HMObility</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-accent-foreground hover:bg-accent-foreground/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  } shadow-sm animate-fade-in`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <HelpCircle className="w-3 h-3" />
              Preguntas frecuentes:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs bg-muted hover:bg-muted/80 px-3 py-1 rounded-full transition-smooth"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu pregunta..."
              className="flex-1"
            />
            <Button onClick={handleSend} className="bg-accent hover:bg-accent/90">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chatbot;
