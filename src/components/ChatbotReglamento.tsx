import { useState, useRef, useEffect } from "react";
import { X, Send, MessageCircle, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { logger } from "@/lib/logger";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  isLoading?: boolean;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Importar datos locales como fallback
import chatbotData from "../data/reglamento.json";

const ChatbotReglamento = ({ isOpen, onClose }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy el asistente virtual de HMObility. Puedo ayudarte con información sobre el Reglamento de Tránsito de Hermosillo 2025. ¿Qué te gustaría saber?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Función de búsqueda local en el JSON
  const buscarEnJSON = (pregunta: string): string => {
    const preguntaLower = pregunta.toLowerCase();
    
    // Buscar en el JSON local
    const resultados = chatbotData.filter((item) => {
      const searchText = `${item.categoria} ${item.subcategoria} ${item.descripcion}`.toLowerCase();
      const palabras = preguntaLower.split(" ").filter(p => p.length > 3);
      return palabras.some(palabra => searchText.includes(palabra));
    });

    if (resultados.length === 0) {
      return "Lo siento, no encontré información específica sobre eso en el reglamento. ¿Podrías reformular tu pregunta o ser más específico?";
    }

    // Construir respuesta con los resultados encontrados
    let respuesta = "Encontré la siguiente información:\n\n";
    
    resultados.slice(0, 3).forEach((item, index) => {
      respuesta += `📌 **${item.subcategoria}**\n`;
      respuesta += `${item.descripcion}\n`;
      if (item.articulo) {
        respuesta += `_${item.articulo}_\n`;
      }
      respuesta += `\n`;
    });

    if (resultados.length > 3) {
      respuesta += `_... y ${resultados.length - 3} resultados más._\n`;
    }

    return respuesta;
  };

  // Función para consultar el backend (con fallback a búsqueda local)
  const consultarBackend = async (pregunta: string): Promise<string> => {
    try {
      // Usar /api en producción (Vercel serverless) o localhost en desarrollo
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pregunta }),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status ${response.status}`);
      }

      const data = await response.json();
      return data.respuesta || buscarEnJSON(pregunta);
    } catch (error) {
      logger.warn("Backend unavailable, using local search", { 
        error: error instanceof Error ? error.message : String(error) 
      });
      return buscarEnJSON(pregunta);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Agregar mensaje de carga
    const loadingMessage: Message = {
      id: messages.length + 2,
      text: "Buscando información...",
      isUser: false,
      isLoading: true,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const respuesta = await consultarBackend(inputValue);

      // Remover mensaje de carga y agregar respuesta real
      setMessages((prev) => {
        const sinLoading = prev.filter(m => !m.isLoading);
        return [
          ...sinLoading,
          {
            id: prev.length + 1,
            text: respuesta,
            isUser: false,
          },
        ];
      });
    } catch (error) {
      logger.error("Error processing chatbot query", {
        error: error instanceof Error ? error.message : String(error),
        query: inputValue,
      });
      
      setMessages((prev) => {
        const sinLoading = prev.filter(m => !m.isLoading);
        return [
          ...sinLoading,
          {
            id: prev.length + 1,
            text: "Lo siento, ocurrió un error al procesar tu pregunta. Por favor, intenta de nuevo.",
            isUser: false,
          },
        ];
      });
      toast.error("Error al consultar el chatbot");
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "¿Cuáles son los límites de velocidad?",
    "¿Qué documentos debo llevar?",
    "¿Cuál es la sanción por conducir en estado de ebriedad?",
    "¿Qué pasa si no uso cinturón de seguridad?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
      <Card className="w-[450px] h-[650px] shadow-2xl border-2 border-primary/20 flex flex-col overflow-hidden backdrop-blur-sm bg-card/95">
        {/* Header con gradiente mejorado */}
        <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary text-white p-5 flex items-center justify-between relative overflow-hidden">
          {/* Efecto de brillo sutil */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 animate-shimmer"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Asistente de Tránsito</h3>
              <p className="text-xs opacity-90 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                En línea • Hermosillo 2025
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 transition-all hover:rotate-90 duration-300 relative z-10"
            aria-label="Cerrar chatbot"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages con diseño mejorado */}
        <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-muted/20 to-transparent" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                role="article"
                aria-label={message.isUser ? "Mensaje del usuario" : "Respuesta del asistente"}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.isUser
                      ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                      : message.isLoading
                      ? "bg-muted text-muted-foreground italic"
                      : "bg-white dark:bg-secondary text-secondary-foreground shadow-md border border-border/50"
                  } transition-all hover:scale-[1.02] duration-200`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span className="text-sm">{message.text}</span>
                    </div>
                  ) : (
                    <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({children}) => <p className="mb-2 last:mb-0">{children}</p>,
                          strong: ({children}) => <strong className="font-bold text-foreground">{children}</strong>,
                          em: ({children}) => <em className="italic text-muted-foreground">{children}</em>,
                          ul: ({children}) => <ul className="list-disc list-inside space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal list-inside space-y-1">{children}</ol>,
                        }}
                      >
                        {message.text}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Quick Questions con diseño mejorado */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3 border-t border-border pt-4 bg-gradient-to-b from-muted/30 to-transparent">
            <p className="text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-primary" aria-hidden="true" />
              💡 Preguntas sugeridas:
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Preguntas frecuentes">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs bg-gradient-to-r from-white to-gray-50 dark:from-secondary dark:to-secondary/80 hover:from-primary/10 hover:to-primary/5 px-4 py-2 rounded-full transition-all duration-300 border border-primary/20 hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  disabled={isLoading}
                  aria-label={`Preguntar: ${q}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input con diseño premium */}
        <div className="p-4 border-t-2 border-primary/10 bg-gradient-to-b from-card to-muted/20">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu pregunta sobre el reglamento..."
              className="flex-1 border-2 border-primary/20 focus:border-primary/50 transition-all rounded-xl shadow-sm"
              disabled={isLoading}
              aria-label="Campo de texto para preguntar al chatbot"
              maxLength={500}
            />
            <Button 
              type="submit"
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl px-6"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Enviar pregunta"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="w-5 h-5" aria-hidden="true" />
              )}
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 text-center flex items-center justify-center gap-1">
            <span className="font-medium">🔒 Seguro</span>
            <span className="text-muted-foreground/60">•</span>
            <span>Reglamento de Tránsito Hermosillo 2025</span>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotReglamento;
