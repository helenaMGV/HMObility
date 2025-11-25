/**
 * Centro de Ayuda con Chat Bot
 * Sistema de soporte y FAQs interactivo
 */

import { useState } from 'react';
import { Search, MessageCircle, X, Send, HelpCircle, Book, Video, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, designSystem } from '@/lib/design-system';
import { analytics, AnalyticsEvents } from '@/lib/analytics';

interface FAQ {
  question: string;
  answer: string;
  category: string;
  helpful?: number;
}

const faqs: FAQ[] = [
  {
    question: '¿Cómo reporto un bache o problema vial?',
    answer: 'Ve a la sección "Reportar" en el menú principal, toca el mapa en la ubicación del problema, selecciona el tipo de incidente y agrega fotos si es posible.',
    category: 'Reportes',
  },
  {
    question: '¿Qué es el High-Injury Network?',
    answer: 'Es la identificación del 6-8% de las calles donde ocurren el 60-70% de los accidentes graves. Basado en metodología Vision Zero para priorizar intervenciones.',
    category: 'Dashboard',
  },
  {
    question: '¿Cómo interpreto el mapa de calor?',
    answer: 'Las zonas rojas indican alta concentración de accidentes. Amarillo indica concentración media, y verde baja incidencia. Puedes filtrar por tipo de accidente y fecha.',
    category: 'Mapa',
  },
  {
    question: '¿Los datos son en tiempo real?',
    answer: 'Los accidentes se actualizan semanalmente desde fuentes oficiales. Los reportes ciudadanos se muestran inmediatamente después de moderación.',
    category: 'Datos',
  },
  {
    question: '¿Puedo descargar los datos?',
    answer: 'Sí, en la sección "Datos Abiertos" puedes descargar todos los datasets en formato CSV, JSON o GeoJSON bajo licencia de datos abiertos.',
    category: 'Datos',
  },
  {
    question: '¿Cómo funciona el juego educativo?',
    answer: 'El juego simula escenarios de tráfico donde aprendes señales viales, prioridad de paso y maniobras seguras. Ganas puntos y desbloqueas niveles.',
    category: 'Juego',
  },
];

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function HelpCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! 👋 Soy el asistente de HMObility. ¿En qué puedo ayudarte hoy?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const filteredFAQs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    analytics.trackEvent('help_chat_message_sent', { message_length: inputMessage.length });

    // Simular respuesta del bot
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }, 1000);

    setInputMessage('');
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    // Respuestas basadas en palabras clave
    if (lowerMessage.includes('reportar') || lowerMessage.includes('reporte')) {
      return 'Para reportar un problema: 1) Ve a la sección "Reportar" 2) Toca el mapa 3) Selecciona el tipo de problema 4) Agrega fotos. ¿Necesitas más detalles?';
    }
    if (lowerMessage.includes('mapa') || lowerMessage.includes('accidente')) {
      return 'El mapa muestra todos los accidentes registrados. Usa los filtros para ver por tipo (choque, atropello, etc.) o fecha. Las zonas rojas indican mayor concentración.';
    }
    if (lowerMessage.includes('datos') || lowerMessage.includes('descargar')) {
      return 'Puedes descargar los datos en formato CSV, JSON o GeoJSON desde la sección "Datos Abiertos" en el menú principal. Son de uso libre.';
    }
    if (lowerMessage.includes('juego')) {
      return 'El juego educativo tiene 3 modalidades: semáforos, cruces y prevención de choques. ¡Aprende seguridad vial mientras juegas!';
    }
    if (lowerMessage.includes('cuenta') || lowerMessage.includes('login')) {
      return 'No necesitas cuenta para ver el mapa y datos. Solo necesitas registrarte si quieres reportar incidentes o guardar favoritos.';
    }

    return 'Interesante pregunta. Te recomiendo revisar la sección de Preguntas Frecuentes o contactar a soporte@hmobility.mx para asistencia personalizada.';
  };

  const handleFAQClick = (faq: FAQ) => {
    analytics.trackEvent('help_faq_clicked', {
      question: faq.question,
      category: faq.category,
    });
  };

  return (
    <>
      {/* Botón flotante */}
      <Button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            analytics.trackEvent('help_center_opened');
          }
        }}
        className={cn(
          'fixed bottom-20 md:bottom-6 right-6 z-40',
          'w-14 h-14 rounded-full shadow-2xl',
          'bg-gradient-to-r from-primary to-secondary',
          'hover:scale-110 transition-transform',
          isOpen && 'scale-0'
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Panel de ayuda */}
      {isOpen && (
        <Card
          className={cn(
            'fixed bottom-20 md:bottom-6 right-6 z-40',
            'w-full max-w-md h-[600px]',
            'shadow-2xl border-2',
            designSystem.animations.entrance.slideUp
          )}
        >
          <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle>Centro de Ayuda</CardTitle>
                  <p className="text-xs text-muted-foreground">Estamos aquí para ayudarte</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 h-[calc(100%-80px)]">
            <Tabs defaultValue="chat" className="h-full flex flex-col">
              <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="faq">FAQs</TabsTrigger>
                <TabsTrigger value="contact">Contacto</TabsTrigger>
              </TabsList>

              {/* Tab: Chat */}
              <TabsContent value="chat" className="flex-1 flex flex-col m-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-lg p-3',
                          message.sender === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-muted text-foreground'
                        )}
                      >
                        <p className="text-sm">{message.text}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString('es-MX', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Escribe tu pregunta..."
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Tab: FAQs */}
              <TabsContent value="faq" className="flex-1 m-0 flex flex-col">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar en FAQs..."
                      className="pl-9"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-white"
                        onClick={() => setSearchQuery(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {filteredFAQs.map((faq, index) => (
                    <Card
                      key={index}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleFAQClick(faq)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm font-semibold">
                            {faq.question}
                          </CardTitle>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {faq.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredFAQs.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No se encontraron preguntas</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Tab: Contacto */}
              <TabsContent value="contact" className="flex-1 m-0 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg mb-4">¿Necesitas más ayuda?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Nuestro equipo está disponible para asistirte
                    </p>
                  </div>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-sm text-muted-foreground">soporte@hmobility.mx</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <p className="font-semibold">Teléfono</p>
                        <p className="text-sm text-muted-foreground">662-123-4567</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Book className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Documentación</p>
                        <p className="text-sm text-muted-foreground">Guías y tutoriales</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <Video className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Videos Tutorial</p>
                        <p className="text-sm text-muted-foreground">youtube.com/hmobility</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </>
  );
}
