import { useState, useEffect } from "react";
import { 
  Target, Users, BookOpen, Shield, Brain, Map, Gamepad2, 
  TrendingUp, AlertTriangle, Activity, Zap, Award, CheckCircle2,
  BarChart3, MapPin, Clock, Lightbulb, Rocket, Eye, ChevronRight,
  Sparkles, Database, Network, Globe, Play, LineChart, Trophy
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import backgroundImage from "@/assets/foto_hermosillo.jpg";
import logoSrc from "@/assets/logo_hmobility.png";

const About = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"ciudadano" | "gobierno" | "desarrollador">("ciudadano");
  const [statsVisible, setStatsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    setStatsVisible(true);
  }, []);

  const stats = [
    { 
      value: "1,402", 
      label: "Elementos OSM Mapeados", 
      icon: MapPin, 
      color: "text-blue-600",
      gradient: "from-blue-500 to-cyan-500"
    },
    { 
      value: "16+", 
      label: "Módulos Analíticos", 
      icon: BarChart3, 
      color: "text-purple-600",
      gradient: "from-purple-500 to-pink-500"
    },
    { 
      value: "3", 
      label: "Juegos Educativos", 
      icon: Gamepad2, 
      color: "text-green-600",
      gradient: "from-green-500 to-emerald-500"
    },
    { 
      value: "25", 
      label: "Tests Automatizados", 
      icon: CheckCircle2, 
      color: "text-emerald-600",
      gradient: "from-emerald-500 to-teal-500"
    },
    { 
      value: "MIT", 
      label: "Licencia Open Source", 
      icon: Globe, 
      color: "text-amber-600",
      gradient: "from-amber-500 to-yellow-500"
    },
    { 
      value: "5+", 
      label: "Fuentes de Datos", 
      icon: Database, 
      color: "text-indigo-600",
      gradient: "from-indigo-500 to-violet-500"
    },
  ];

  const features = [
    {
      category: "Análisis Geoespacial",
      icon: Brain,
      color: "from-purple-500 to-pink-500",
      items: [
        "📊 Kernel Density Estimation (KDE) para hot spots",
        "🔍 Clustering espacial con DBSCAN",
        "📈 Análisis de correlación espacial (Moran's I)",
        "🗺️ Mapas de calor con intensidad ponderada"
      ]
    },
    {
      category: "Infraestructura Vial (OSM)",
      icon: Map,
      color: "from-blue-500 to-cyan-500",
      items: [
        "🚦 112 semáforos georeferenciados",
        "🚶 233 cruces peatonales mapeados",
        "🚴 39 ciclovías identificadas",
        "🛣️ 1,018 calles principales catalogadas"
      ]
    },
    {
      category: "Educación Vial Interactiva",
      icon: Gamepad2,
      color: "from-green-500 to-emerald-500",
      items: [
        "🚦 Quiz de semáforos con 5 escenarios",
        "🚶 Tutorial paso a paso de cruce seguro",
        "🚗 Protocolo post-accidente estructurado",
        "📊 Evaluación con retroalimentación inmediata"
      ]
    },
    {
      category: "Dashboard Analítico",
      icon: Shield,
      color: "from-red-500 to-orange-500",
      items: [
        "📋 16+ módulos de visualización de datos",
        "🎯 Indicadores de Vision Zero Framework",
        "📊 Exportación multi-formato (JSON/CSV/GeoJSON)",
        "🗂️ Filtros temporales y espaciales"
      ]
    },
    {
      category: "Datos Abiertos",
      icon: Users,
      color: "from-amber-500 to-yellow-500",
      items: [
        "🌐 OpenStreetMap (licencia ODbL)",
        "📱 Sistema de reportes georeferenciados",
        "📊 Datasets descargables en formatos estándar",
        "💬 API de consulta del reglamento de tránsito"
      ]
    },
    {
      category: "Stack Tecnológico",
      icon: Zap,
      color: "from-indigo-500 to-violet-500",
      items: [
        "⚛️ React 18 + TypeScript + Vite 5",
        "🧪 Testing automatizado con Vitest (25 tests)",
        "🗺️ Leaflet 1.9 + Overpass API",
        "☁️ Vercel Edge Functions (serverless)"
      ]
    },
  ];

  const personas = {
    ciudadano: {
      title: "Para Ciudadanos",
      icon: Users,
      color: "text-blue-600",
      benefits: [
        { icon: Map, text: "Visualiza 1,402 elementos de infraestructura OSM" },
        { icon: Eye, text: "Explora mapas de calor y análisis espacial" },
        { icon: Gamepad2, text: "Aprende educación vial con juegos interactivos" },
        { icon: MapPin, text: "Contribuye con reportes georeferenciados" },
        { icon: BookOpen, text: "Consulta el reglamento de tránsito de Sonora" },
      ],
      cta: { text: "Explorar Mapa", action: () => navigate("/mapa") }
    },
    gobierno: {
      title: "Para Gobierno",
      icon: Shield,
      color: "text-red-600",
      benefits: [
        { icon: BarChart3, text: "16 módulos de visualización analítica" },
        { icon: LineChart, text: "Indicadores cuantificables de siniestralidad" },
        { icon: Target, text: "Identificación de High Injury Networks (HIN)" },
        { icon: Database, text: "Exportación multi-formato (JSON/CSV/GeoJSON)" },
        { icon: Network, text: "Integración de múltiples fuentes de datos" },
      ],
      cta: { text: "Ver Dashboard", action: () => navigate("/gobierno") }
    },
    desarrollador: {
      title: "Para Desarrolladores",
      icon: Rocket,
      color: "text-purple-600",
      benefits: [
        { icon: Globe, text: "Código abierto bajo licencia MIT" },
        { icon: CheckCircle2, text: "25 tests automatizados con Vitest" },
        { icon: Network, text: "Stack moderno: React 18, TypeScript, Vite 5" },
        { icon: Database, text: "Datos GeoJSON descargables (OSM, ODbL)" },
        { icon: LineChart, text: "Arquitectura serverless en Vercel" },
      ],
      cta: { text: "Ver GitHub", action: () => window.open("https://github.com/helenaMGV/hmobility-safe-streets", "_blank") }
    },
  };

  const currentPersona = personas[activeTab];
  const PersonaIcon = currentPersona.icon;

  return (
    <section className="py-16 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <div className="relative rounded-3xl overflow-hidden mb-20 shadow-2xl">
            <img
              src={backgroundImage}
              alt="Hermosillo ciudad vista panorámica"
              className="w-full h-96 object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/90 to-accent/90 flex items-center justify-center">
              <div className="text-center space-y-6 px-4">
                <img 
                  src={logoSrc} 
                  alt="Logo HMObility Hermosillo" 
                  className="h-24 mx-auto mb-6 drop-shadow-2xl animate-scale-in"
                  loading="lazy"
                  decoding="async"
                  width="96"
                  height="96"
                />
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl animate-fade-in">
                  HMObility Safe Streets
                </h1>
                <p className="text-2xl md:text-3xl text-white/95 max-w-3xl mx-auto drop-shadow-lg font-light animate-slide-up">
                  Plataforma de Análisis y Educación Vial
                </p>
                <Badge className="bg-white/20 text-white border-white/40 text-lg px-6 py-2">
                  🚗 Especializada en Movilidad Urbana
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20 animate-slide-up">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index} 
                  className={`shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-t-4 border-transparent hover:border-current ${stat.color}`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    opacity: statsVisible ? 1 : 0,
                    transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s ease-out'
                  }}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-3 rounded-full bg-gradient-to-br ${stat.gradient} mb-3`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Mission Statement */}
          <div className="text-center mb-20 animate-fade-in space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">Nuestra Misión</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Metodología Científica para Movilidad Segura
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-xl md:text-2xl text-foreground leading-relaxed font-light">
                HMObility integra múltiples fuentes de datos geoespaciales (OpenStreetMap, reportes ciudadanos, 
                infraestructura vial) con <span className="font-bold text-primary">metodologías de análisis espacial</span> para 
                identificar patrones de riesgo y priorizar <span className="font-semibold text-secondary">intervenciones basadas en evidencia</span>.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 text-left">
                <Card className="border-l-4 border-blue-500">
                  <CardContent className="p-6">
                    <Brain className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-bold text-lg mb-2">Análisis Espacial</h3>
                    <p className="text-sm text-muted-foreground">
                      Kernel Density Estimation y clustering para identificar High Injury Networks
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-green-500">
                  <CardContent className="p-6">
                    <Zap className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-bold text-lg mb-2">Educación Vial</h3>
                    <p className="text-sm text-muted-foreground">
                      Aprendizaje activo mediante gamificación y simulación de escenarios reales
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-l-4 border-purple-500">
                  <CardContent className="p-6">
                    <Award className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-bold text-lg mb-2">Visualización</h3>
                    <p className="text-sm text-muted-foreground">
                      Dashboards interactivos para exploración de datos y toma de decisiones
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Personas Tabs */}
          <div className="mb-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo te Ayudamos?</h2>
              <p className="text-lg text-muted-foreground">Diseñado para cada usuario del ecosistema urbano</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
              {Object.entries(personas).map(([key, persona]) => {
                const Icon = persona.icon;
                return (
                  <Button
                    key={key}
                    variant={activeTab === key ? "default" : "outline"}
                    onClick={() => setActiveTab(key as typeof activeTab)}
                    className={`gap-2 text-base px-6 py-6 ${activeTab === key ? 'shadow-lg scale-105' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    {persona.title}
                  </Button>
                );
              })}
            </div>

            {/* Tab Content */}
            <Card className="shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${
                    activeTab === 'ciudadano' ? 'from-blue-500 to-cyan-500' :
                    activeTab === 'gobierno' ? 'from-red-500 to-orange-500' :
                    'from-purple-500 to-pink-500'
                  }`}>
                    <PersonaIcon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-3xl font-bold ${currentPersona.color}`}>
                      {currentPersona.title}
                    </h3>
                    <p className="text-muted-foreground">Herramientas diseñadas para ti</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {currentPersona.benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="p-2 rounded-lg bg-background">
                          <Icon className={`w-5 h-5 ${currentPersona.color}`} />
                        </div>
                        <span className="text-sm font-medium">{benefit.text}</span>
                      </div>
                    );
                  })}
                </div>

                <Button 
                  onClick={currentPersona.cta.action}
                  size="lg"
                  className="w-full md:w-auto gap-2 text-lg px-8 py-6"
                >
                  <Play className="w-5 h-5" />
                  {currentPersona.cta.text}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-2">
                <Lightbulb className="w-4 h-4 mr-2" />
                Capacidades del Sistema
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Todo lo que Puedes Hacer
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                16+ módulos profesionales, 3 juegos educativos, y miles de datos abiertos
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isHovered = hoveredFeature === index;
                
                return (
                  <Card 
                    key={index}
                    className={`shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                      isHovered ? 'scale-105 border-primary' : ''
                    }`}
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-lg">{feature.category}</h3>
                      </div>
                      
                      <ul className="space-y-2">
                        {feature.items.map((item, idx) => (
                          <li 
                            key={idx}
                            className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded hover:bg-muted/50 transition-colors"
                          >
                            <span className="flex-shrink-0 mt-0.5">{item.split(' ')[0]}</span>
                            <span>{item.substring(item.indexOf(' ') + 1)}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Metodología Vision Zero */}
          <Card className="mb-20 shadow-xl border-t-4 border-primary">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <Target className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Enfoque Vision Zero</h2>
                <p className="text-lg text-muted-foreground">
                  Marco metodológico para reducción de siniestralidad vial
                </p>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                {/* Metodología */}
                <div className="p-6 bg-muted/50 rounded-xl">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Metodología Aplicada
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      <strong className="text-foreground">High Injury Network (HIN):</strong> Identificación del 10% de calles 
                      con mayor concentración de siniestros mediante análisis de densidad kernel:
                    </p>
                    <code className="block bg-background p-3 rounded font-mono text-xs">
                      KDE(x) = (1/nh) Σᵢ K((x - xᵢ)/h)
                    </code>
                    <p className="text-xs italic">
                      Donde K es función kernel gaussiana, h es bandwidth, y xᵢ son coordenadas de eventos
                    </p>
                    
                    <p className="mt-4">
                      <strong className="text-foreground">Clustering Espacial:</strong> DBSCAN (Density-Based Spatial Clustering) 
                      para agrupar puntos críticos:
                    </p>
                    <code className="block bg-background p-3 rounded font-mono text-xs">
                      ε-neighborhood: N_ε(p) = &#123;q ∈ D | dist(p,q) ≤ ε&#125;
                    </code>
                  </div>
                </div>

                {/* Estado del Proyecto */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Estado de Implementación</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-sm">Infraestructura OSM Catalogada</span>
                        <span className="text-primary font-bold text-sm">1,402 elementos</span>
                      </div>
                      <Progress value={100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-sm">Módulos Analíticos</span>
                        <span className="text-blue-600 font-bold text-sm">16 visualizaciones</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-sm">Cobertura de Tests</span>
                        <span className="text-green-600 font-bold text-sm">25 tests (objetivo: 80%)</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium text-sm">Módulos Educativos</span>
                        <span className="text-purple-600 font-bold text-sm">3 juegos interactivos</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Roadmap */}
                <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl">
                  <div className="flex items-start gap-4">
                    <Rocket className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-lg mb-3">Roadmap de Desarrollo</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-muted-foreground">Sprint 1: Testing Infrastructure (25 tests, Vitest)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-muted-foreground">Sprint 2: Juegos educativos interactivos (3/5)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600" />
                          <span className="text-muted-foreground">Sprint 3: PWA y Service Workers (en progreso)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-muted-foreground">Sprint 4: Monitoreo con Sentry y analytics</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Principles */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {[
              {
                icon: Target,
                title: "Evidencia Empírica",
                description: "Decisiones basadas en análisis cuantitativo de datos geoespaciales y estadísticos",
                color: "from-red-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "Rigor Metodológico",
                description: "Aplicación de técnicas validadas: KDE, clustering espacial, análisis de correlación",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Participación Ciudadana",
                description: "Integración de reportes georeferenciados como fuente complementaria de datos",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: BookOpen,
                title: "Transparencia",
                description: "Código abierto (MIT), datos descargables y metodología documentada públicamente",
                color: "from-purple-500 to-pink-500"
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tech Stack */}
          <Card className="mb-20 shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <Zap className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Stack Tecnológico</h2>
                <p className="text-white/70">Tecnologías de vanguardia para máximo rendimiento</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { category: "Frontend", items: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui"] },
                  { category: "Datos & Mapas", items: ["Leaflet", "OpenStreetMap", "GeoJSON", "Overpass API", "MapLibre"] },
                  { category: "Backend & Deploy", items: ["Vercel (Serverless)", "Python API", "Vitest", "GitHub Actions", "Sentry"] },
                ].map((stack, index) => (
                  <div key={index} className="p-6 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-bold text-lg mb-4 text-amber-400">{stack.category}</h3>
                    <ul className="space-y-2">
                      {stack.items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl p-12 md:p-16 shadow-2xl">
            <Rocket className="w-20 h-20 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explora los Datos
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Visualiza infraestructura vial, analiza patrones espaciales y aprende sobre seguridad vial
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate("/mapa")}
                className="gap-2 text-lg px-8 py-6 shadow-xl hover:scale-105 transition-transform"
              >
                <Map className="w-5 h-5" />
                Ver Mapa Interactivo
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/juego")}
                className="gap-2 text-lg px-8 py-6 bg-white/10 border-white/30 text-white hover:bg-white/20 shadow-xl hover:scale-105 transition-transform"
              >
                <Gamepad2 className="w-5 h-5" />
                Jugar y Aprender
              </Button>
            </div>
          </div>

          {/* Official Links */}
          <div className="text-center mt-20 animate-scale-in">
            <h2 className="text-2xl font-bold mb-4">Información Oficial</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Este proyecto se basa en la normativa vigente de tránsito del Estado de Sonora
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => window.open("https://www.hermosillo.gob.mx", "_blank")}
                className="gap-2"
              >
                <Globe className="w-4 h-4" />
                Gobierno de Hermosillo
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open("https://www.congresoson.gob.mx", "_blank")}
                className="gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Congreso del Estado de Sonora
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
