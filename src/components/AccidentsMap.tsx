import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  AlertCircle, 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  Car,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Filter,
  X,
  ExternalLink,
  Newspaper,
  Camera,
  Shield,
  Cloud
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { format } from "date-fns";
import "leaflet/dist/leaflet.css";
import "./map-styles.css";
import L from "leaflet";

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons based on accident severity
const createCustomIcon = (severity: string) => {
  const colors: Record<string, string> = {
    grave: '#dc2626',      // red-600
    moderado: '#f59e0b',   // amber-500
    leve: '#10b981',       // green-500
  };

  const color = colors[severity] || '#6b7280'; // gray-500 as fallback

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 3px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          color: white;
          font-size: 16px;
          transform: rotate(45deg);
          font-weight: bold;
        ">!</div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

interface AccidentData {
  id_evento: string;
  tipo_accidente: string;
  medio_reporta: string;
  fecha_accidente: string;
  fecha_reporte: string;
  hora_reporte: string;
  ubicacion: {
    direccion_completa: string;
    ubicacion_exacta: string;
    colonia: string;
    municipio: string;
    estado: string;
    coordenadas: {
      lat: number;
      lon: number;
    };
  };
  vehiculo_involucrado: {
    tipo: string;
    descripcion: string;
  };
  numero_heridos: number;
  numero_defunciones: number;
  danos_materiales: string;
  afectaciones: string[];
  intervencion_servicios_emergencia?: {
    policia_transito: boolean;
    ambulancia: boolean;
    bomberos: boolean;
  };
  instituciones_intervinientes?: string[];
  condiciones_climaticas?: string;
  descripcion_evento: string;
  reportero?: string;
  fotografo?: string;
  fuente_url?: string;
  mapa_url?: string;
  clasificacion_evento: {
    nivel_gravedad: string;
    riesgo_publico: string;
  };
  mapa_zona_riesgo?: boolean;
  tags: string[];
  creado_por?: string;
  fecha_ingreso_bd?: string;
}

interface MapCenterProps {
  center: [number, number];
}

function MapCenter({ center }: MapCenterProps) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

const AccidentsMap = () => {
  const [accidents, setAccidents] = useState<AccidentData[]>([]);
  const [selectedAccident, setSelectedAccident] = useState<AccidentData | null>(null);
  const [filterColonia, setFilterColonia] = useState<string>("all");
  const [filterGravedad, setFilterGravedad] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [mapCenter, setMapCenter] = useState<[number, number]>([29.0729, -110.9559]); // Hermosillo center

  // Helper function to clean date strings
  const cleanDateString = (dateStr: string): string => {
    // Remove non-breaking hyphens and other special characters
    return dateStr.replace(/[\u2011\u2012\u2013\u2014\u2015]/g, '-');
  };

  // Helper function to format date safely
  const formatDate = (dateStr: string): string => {
    try {
      const cleanDate = cleanDateString(dateStr);
      const date = new Date(cleanDate);
      if (isNaN(date.getTime())) {
        return dateStr; // Return original if can't parse
      }
      return format(date, "dd/MM/yyyy");
    } catch (err) {
      console.error("Error formatting date:", err);
      return dateStr;
    }
  };

  useEffect(() => {
    // Load all accident data from JSON files in datajson folder
    const loadAccidents = async () => {
      try {
        const jsonFiles = [
          "/datajson/HMO_20251110_001.json",
          "/datajson/HMO_20251110_002.json"
        ];

        const promises = jsonFiles.map(file => 
          fetch(file)
            .then(res => {
              if (!res.ok) {
                console.warn(`Could not load ${file}: ${res.status}`);
                return null;
              }
              return res.json();
            })
            .catch(err => {
              console.warn(`Error loading ${file}:`, err);
              return null;
            })
        );

        const results = await Promise.all(promises);
        const validAccidents = results.filter(data => data !== null);
        
        console.log(`Loaded ${validAccidents.length} accident records from datajson folder`);
        setAccidents(validAccidents);
      } catch (err) {
        console.error("Error loading accident data:", err);
        setAccidents([]);
      }
    };

    loadAccidents();
  }, []);

  const filteredAccidents = accidents.filter((accident) => {
    if (filterColonia !== "all" && accident.ubicacion.colonia !== filterColonia) return false;
    if (filterGravedad !== "all" && accident.clasificacion_evento.nivel_gravedad !== filterGravedad) return false;
    
    try {
      const cleanDate = cleanDateString(accident.fecha_accidente);
      const accidentDate = new Date(cleanDate);
      if (!isNaN(accidentDate.getTime())) {
        if (dateFrom && accidentDate < dateFrom) return false;
        if (dateTo && accidentDate > dateTo) return false;
      }
    } catch (err) {
      console.error("Error parsing date:", err);
    }
    
    return true;
  });

  const colonias = Array.from(new Set(accidents.map((a) => a.ubicacion.colonia)));
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "grave": return "hsl(0, 84%, 60%)";
      case "moderado": return "hsl(43, 93%, 49%)";
      case "leve": return "hsl(183, 48%, 53%)";
      default: return "hsl(var(--muted))";
    }
  };

  const getSeverityBadgeVariant = (severity: string): "destructive" | "default" | "secondary" => {
    switch (severity) {
      case "grave": return "destructive";
      case "moderado": return "default";
      case "leve": return "secondary";
      default: return "secondary";
    }
  };

  // Statistics
  const accidentsByType = filteredAccidents.reduce((acc, curr) => {
    const type = curr.tipo_accidente.replace(/_/g, " ");
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(accidentsByType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  const severityData = filteredAccidents.reduce((acc, curr) => {
    const severity = curr.clasificacion_evento.nivel_gravedad;
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(severityData).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: getSeverityColor(name)
  }));

  const totalHeridos = filteredAccidents.reduce((sum, a) => sum + a.numero_heridos, 0);
  const totalDefunciones = filteredAccidents.reduce((sum, a) => sum + a.numero_defunciones, 0);

  const handleMarkerClick = (accident: AccidentData) => {
    setSelectedAccident(accident);
    setMapCenter([accident.ubicacion.coordenadas.lat, accident.ubicacion.coordenadas.lon]);
  };

  const clearFilters = () => {
    setFilterColonia("all");
    setFilterGravedad("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <MapPin className="w-10 h-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-gradient">
            Mapa de Accidentes
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Visualiza y analiza los accidentes viales registrados en Hermosillo
        </p>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              <CardTitle>Filtros</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Limpiar
            </Button>
          </div>
          <CardDescription>
            Filtra los accidentes por colonia, gravedad o fecha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Colonia</label>
              <Select value={filterColonia} onValueChange={setFilterColonia}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las colonias</SelectItem>
                  {colonias.map((colonia) => (
                    <SelectItem key={colonia} value={colonia}>
                      {colonia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Gravedad</label>
              <Select value={filterGravedad} onValueChange={setFilterGravedad}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="leve">Leve</SelectItem>
                  <SelectItem value="moderado">Moderado</SelectItem>
                  <SelectItem value="grave">Grave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Fecha desde</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Fecha hasta</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "Seleccionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="shadow-card border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Accidentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{filteredAccidents.length}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Heridos</CardTitle>
            <Users className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{totalHeridos}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-destructive">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Defunciones</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalDefunciones}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Colonias</CardTitle>
            <MapPin className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{colonias.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content: Map + Details Side by Side */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Map - Takes 3 columns */}
        <div className="lg:col-span-3">
          <Card className="shadow-elegant h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <CardTitle>Mapa Interactivo</CardTitle>
                </div>
                {selectedAccident && (
                  <Badge variant="outline" className="animate-pulse">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Accidente seleccionado
                  </Badge>
                )}
              </div>
              <CardDescription>
                Haz clic en los marcadores para ver detalles completos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[700px] rounded-lg overflow-hidden border border-border shadow-sm relative">
                {/* Map Legend */}
                <div className="absolute top-4 right-4 z-[1000] bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Nivel de Gravedad
                  </p>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-sm"></div>
                      <span className="text-xs">Grave</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm"></div>
                      <span className="text-xs">Moderado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                      <span className="text-xs">Leve</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2 pt-2 border-t border-border">
                    {filteredAccidents.length} {filteredAccidents.length === 1 ? 'evento' : 'eventos'} en el mapa
                  </p>
                </div>

                <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapCenter center={mapCenter} />
                  {filteredAccidents.map((accident) => (
                    <Marker
                      key={accident.id_evento}
                      position={[accident.ubicacion.coordenadas.lat, accident.ubicacion.coordenadas.lon]}
                      icon={createCustomIcon(accident.clasificacion_evento.nivel_gravedad)}
                      eventHandlers={{
                        click: () => handleMarkerClick(accident),
                      }}
                    >
                      <Popup>
                        <div className="p-2 min-w-[200px]">
                          <h3 className="font-bold mb-1 capitalize text-base">
                            {accident.tipo_accidente.replace(/_/g, " ")}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {accident.ubicacion.colonia}
                          </p>
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={getSeverityBadgeVariant(accident.clasificacion_evento.nivel_gravedad)}>
                              {accident.clasificacion_evento.nivel_gravedad}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              Click para más detalles →
                            </span>
                          </div>
                          {accident.fuente_url && (
                            <a
                              href={accident.fuente_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                              Ver noticia completa
                            </a>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card className="shadow-elegant sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-hidden flex flex-col">
            <CardHeader className="bg-gradient-card border-b border-border pb-4">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Detalles del Evento
              </CardTitle>
              {selectedAccident && (
                <CardDescription className="text-xs">
                  ID: {selectedAccident.id_evento}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1 pt-4">
              {selectedAccident ? (
                <div className="space-y-4 animate-fade-in">
                  {/* Header with Type and Severity */}
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                    <h3 className="font-bold text-xl mb-3 capitalize text-primary">
                      {selectedAccident.tipo_accidente.replace(/_/g, " ")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getSeverityBadgeVariant(selectedAccident.clasificacion_evento.nivel_gravedad)}
                        className="text-sm px-3 py-1"
                      >
                        Nivel: {selectedAccident.clasificacion_evento.nivel_gravedad}
                      </Badge>
                      <Badge variant="outline" className="text-sm px-3 py-1">
                        Riesgo: {selectedAccident.clasificacion_evento.riesgo_publico}
                      </Badge>
                    </div>
                  </div>

                  {/* Key Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20 text-center">
                      <Users className="w-5 h-5 mx-auto mb-1 text-secondary" />
                      <p className="text-xs text-muted-foreground">Heridos</p>
                      <p className="font-bold text-xl text-secondary">{selectedAccident.numero_heridos}</p>
                    </div>
                    <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
                      <AlertCircle className="w-5 h-5 mx-auto mb-1 text-destructive" />
                      <p className="text-xs text-muted-foreground">Defunciones</p>
                      <p className="font-bold text-xl text-destructive">{selectedAccident.numero_defunciones}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-4 h-4 text-primary" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Fecha y Hora
                      </p>
                    </div>
                    <p className="font-bold text-lg">{formatDate(selectedAccident.fecha_accidente)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Hora del reporte: {selectedAccident.hora_reporte}
                    </p>
                  </div>

                  {/* Location */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Ubicación
                      </p>
                    </div>
                    <p className="font-semibold text-base mb-1">
                      {selectedAccident.ubicacion.direccion_completa}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Colonia {selectedAccident.ubicacion.colonia}, {selectedAccident.ubicacion.municipio}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      📍 {selectedAccident.ubicacion.coordenadas.lat.toFixed(6)}, {selectedAccident.ubicacion.coordenadas.lon.toFixed(6)}
                    </p>
                  </div>

                  {/* Vehicle */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-4 h-4 text-primary" />
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Vehículo Involucrado
                      </p>
                    </div>
                    <p className="font-semibold capitalize text-base">
                      {selectedAccident.vehiculo_involucrado.tipo}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedAccident.vehiculo_involucrado.descripcion}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Descripción del Evento
                    </p>
                    <p className="text-sm leading-relaxed">{selectedAccident.descripcion_evento}</p>
                  </div>

                  {/* Damages */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Daños Materiales
                    </p>
                    <p className="text-sm">{selectedAccident.danos_materiales}</p>
                  </div>

                  {/* Affectations */}
                  <div className="p-4 bg-muted/30 rounded-lg border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Afectaciones
                    </p>
                    <ul className="space-y-2">
                      {selectedAccident.afectaciones.map((afect, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">▪</span>
                          <span>{afect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Emergency Services */}
                  {selectedAccident.intervencion_servicios_emergencia && (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Servicios de Emergencia
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedAccident.intervencion_servicios_emergencia.policia_transito && (
                          <Badge variant="outline">🚓 Policía de Tránsito</Badge>
                        )}
                        {selectedAccident.intervencion_servicios_emergencia.ambulancia && (
                          <Badge variant="outline">🚑 Ambulancia</Badge>
                        )}
                        {selectedAccident.intervencion_servicios_emergencia.bomberos && (
                          <Badge variant="outline">🚒 Bomberos</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Institutions */}
                  {selectedAccident.instituciones_intervinientes && selectedAccident.instituciones_intervinientes.length > 0 && (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Instituciones Intervinientes
                        </p>
                      </div>
                      <ul className="space-y-2">
                        {selectedAccident.instituciones_intervinientes.map((inst, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{inst}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weather Conditions */}
                  {selectedAccident.condiciones_climaticas && (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Cloud className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Condiciones Climáticas
                        </p>
                      </div>
                      <p className="text-sm capitalize">{selectedAccident.condiciones_climaticas}</p>
                    </div>
                  )}

                  {/* Source Information */}
                  {(selectedAccident.medio_reporta || selectedAccident.reportero || selectedAccident.fotografo) && (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Newspaper className="w-4 h-4 text-primary" />
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Información de la Fuente
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        {selectedAccident.medio_reporta && (
                          <div>
                            <span className="text-muted-foreground">Medio: </span>
                            <span className="font-medium">{selectedAccident.medio_reporta}</span>
                          </div>
                        )}
                        {selectedAccident.reportero && (
                          <div>
                            <span className="text-muted-foreground">Reportero: </span>
                            <span className="font-medium">{selectedAccident.reportero}</span>
                          </div>
                        )}
                        {selectedAccident.fotografo && (
                          <div className="flex items-center gap-2">
                            <Camera className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">Fotógrafo: </span>
                            <span className="font-medium">{selectedAccident.fotografo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Links Section */}
                  {(selectedAccident.fuente_url || selectedAccident.mapa_url) && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Enlaces Externos
                      </p>
                      <div className="space-y-2">
                        {selectedAccident.fuente_url && (
                          <a
                            href={selectedAccident.fuente_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline hover:text-primary/80 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 flex-shrink-0" />
                            <span>Ver noticia completa en {selectedAccident.medio_reporta || 'la fuente'}</span>
                          </a>
                        )}
                        {selectedAccident.mapa_url && (
                          <a
                            href={selectedAccident.mapa_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-secondary hover:underline hover:text-secondary/80 transition-colors"
                          >
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span>Abrir en Google Maps</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Risk Zone Indicator */}
                  {selectedAccident.mapa_zona_riesgo !== undefined && (
                    <div className={`p-4 rounded-lg border ${
                      selectedAccident.mapa_zona_riesgo 
                        ? 'bg-destructive/10 border-destructive/20' 
                        : 'bg-accent/10 border-accent/20'
                    }`}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`w-4 h-4 ${
                          selectedAccident.mapa_zona_riesgo ? 'text-destructive' : 'text-accent'
                        }`} />
                        <p className="text-sm font-semibold">
                          {selectedAccident.mapa_zona_riesgo 
                            ? '⚠️ Zona de Riesgo Identificada' 
                            : '✓ No es Zona de Riesgo'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedAccident.tags.length > 0 && (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Etiquetas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedAccident.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metadata Footer */}
                  {(selectedAccident.creado_por || selectedAccident.fecha_ingreso_bd) && (
                    <div className="p-3 bg-muted/20 rounded-lg border border-border/50 text-xs text-muted-foreground">
                      {selectedAccident.creado_por && (
                        <div className="mb-1">
                          <span className="font-medium">Sistema: </span>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            {selectedAccident.creado_por}
                          </code>
                        </div>
                      )}
                      {selectedAccident.fecha_ingreso_bd && (
                        <div>
                          <span className="font-medium">Fecha de ingreso: </span>
                          {formatDate(selectedAccident.fecha_ingreso_bd.split('T')[0])}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">No hay evento seleccionado</p>
                  <p className="text-sm">
                    Haz clic en un marcador del mapa para ver los detalles completos del accidente
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      {filteredAccidents.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Accidentes por Tipo
              </CardTitle>
              <CardDescription>Distribución de accidentes registrados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    angle={-15}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(32 94% 50%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Nivel de Gravedad
              </CardTitle>
              <CardDescription>Clasificación por severidad</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AccidentsMap;
