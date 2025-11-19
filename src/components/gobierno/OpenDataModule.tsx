import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Database, 
  Download, 
  FileJson,
  FileSpreadsheet,
  Calendar,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Activity,
  Search
} from 'lucide-react';

interface Dataset {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: 'accidentes' | 'infraestructura' | 'flujos' | 'reportes' | 'campanas';
  formato: 'JSON' | 'CSV' | 'GeoJSON';
  registros: number;
  ultima_actualizacion: string;
  frecuencia_actualizacion: string;
  tamano_mb: number;
  descargas: number;
}

export default function OpenDataModule() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('todas');

  const datasets: Dataset[] = [
    {
      id: 'DS-001',
      nombre: 'Accidentes Viales Hermosillo',
      descripcion: 'Registro histórico de accidentes viales en Hermosillo con ubicación, gravedad, modo y condiciones',
      categoria: 'accidentes',
      formato: 'JSON',
      registros: 847,
      ultima_actualizacion: '2025-11-15',
      frecuencia_actualizacion: 'Diaria',
      tamano_mb: 2.3,
      descargas: 1247,
    },
    {
      id: 'DS-002',
      nombre: 'Inventario de Activos Viales',
      descripcion: 'Catálogo completo de infraestructura vial: semáforos, señales, topes, bardas, luminarias',
      categoria: 'infraestructura',
      formato: 'GeoJSON',
      registros: 1234,
      ultima_actualizacion: '2025-11-10',
      frecuencia_actualizacion: 'Semanal',
      tamano_mb: 4.8,
      descargas: 892,
    },
    {
      id: 'DS-003',
      nombre: 'Reportes Ciudadanos',
      descripcion: 'Reportes de problemas de movilidad enviados por ciudadanos con ubicación y estatus',
      categoria: 'reportes',
      formato: 'JSON',
      registros: 156,
      ultima_actualizacion: '2025-11-17',
      frecuencia_actualizacion: 'Tiempo real',
      tamano_mb: 0.8,
      descargas: 534,
    },
    {
      id: 'DS-004',
      nombre: 'Flujos Origen-Destino',
      descripcion: 'Patrones de movilidad O-D con volumen, modo principal y hora pico',
      categoria: 'flujos',
      formato: 'CSV',
      registros: 45,
      ultima_actualizacion: '2025-11-01',
      frecuencia_actualizacion: 'Mensual',
      tamano_mb: 0.3,
      descargas: 678,
    },
    {
      id: 'DS-005',
      nombre: 'Campañas de Seguridad Vial',
      descripcion: 'Historial de campañas de prevención y educación con indicadores de efectividad',
      categoria: 'campanas',
      formato: 'JSON',
      registros: 24,
      ultima_actualizacion: '2025-11-12',
      frecuencia_actualizacion: 'Quincenal',
      tamano_mb: 0.2,
      descargas: 312,
    },
    {
      id: 'DS-006',
      nombre: 'High-Injury Network',
      descripcion: 'Segmentos viales con mayor concentración de accidentes graves y fatales',
      categoria: 'accidentes',
      formato: 'GeoJSON',
      registros: 87,
      ultima_actualizacion: '2025-11-14',
      frecuencia_actualizacion: 'Trimestral',
      tamano_mb: 1.2,
      descargas: 1089,
    },
    {
      id: 'DS-007',
      nombre: 'Costos de Infraestructura',
      descripcion: 'Costos de instalación, mantenimiento y reparación de activos viales',
      categoria: 'infraestructura',
      formato: 'CSV',
      registros: 234,
      ultima_actualizacion: '2025-10-30',
      frecuencia_actualizacion: 'Mensual',
      tamano_mb: 0.5,
      descargas: 445,
    },
  ];

  const datasetsFiltrados = datasets.filter((dataset) => {
    const cumpleBusqueda = 
      dataset.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      dataset.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const cumpleCategoria = categoriaFiltro === 'todas' || dataset.categoria === categoriaFiltro;
    return cumpleBusqueda && cumpleCategoria;
  });

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'accidentes': return AlertTriangle;
      case 'infraestructura': return MapPin;
      case 'flujos': return Activity;
      case 'reportes': return FileJson;
      case 'campanas': return TrendingUp;
      default: return Database;
    }
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case 'accidentes': return 'bg-destructive/10 text-destructive';
      case 'infraestructura': return 'bg-secondary/10 text-secondary-foreground';
      case 'flujos': return 'bg-accent/10 text-accent-foreground';
      case 'reportes': return 'bg-primary/10 text-primary';
      case 'campanas': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getFormatoIcon = (formato: string) => {
    switch (formato) {
      case 'JSON':
      case 'GeoJSON':
        return FileJson;
      case 'CSV':
        return FileSpreadsheet;
      default:
        return Database;
    }
  };

  const totalDatasets = datasets.length;
  const totalRegistros = datasets.reduce((sum, d) => sum + d.registros, 0);
  const totalDescargas = datasets.reduce((sum, d) => sum + d.descargas, 0);
  const tamanoTotal = datasets.reduce((sum, d) => sum + d.tamano_mb, 0);

  const categorias = [
    { value: 'todas', label: 'Todas las Categorías', count: datasets.length },
    { value: 'accidentes', label: 'Accidentes', count: datasets.filter(d => d.categoria === 'accidentes').length },
    { value: 'infraestructura', label: 'Infraestructura', count: datasets.filter(d => d.categoria === 'infraestructura').length },
    { value: 'flujos', label: 'Flujos', count: datasets.filter(d => d.categoria === 'flujos').length },
    { value: 'reportes', label: 'Reportes', count: datasets.filter(d => d.categoria === 'reportes').length },
    { value: 'campanas', label: 'Campañas', count: datasets.filter(d => d.categoria === 'campanas').length },
  ];

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Datasets Disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalDatasets}</div>
            <p className="text-xs text-muted-foreground">Conjuntos de datos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Registros</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(totalRegistros / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Registros disponibles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Descargas Totales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(totalDescargas / 1000).toFixed(1)}K</div>
            <p className="text-xs text-primary">+15% este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tamaño Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tamanoTotal.toFixed(1)} MB</div>
            <p className="text-xs text-muted-foreground">Datos públicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Datos Abiertos</CardTitle>
          <CardDescription>
            Datos públicos de movilidad en formato abierto y reutilizable
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar datasets por nombre o descripción..."
                className="pl-10"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          {/* Categories Pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categorias.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoriaFiltro(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  categoriaFiltro === cat.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Datasets Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Datasets
              </CardTitle>
              <CardDescription>
                Mostrando {datasetsFiltrados.length} de {totalDatasets} datasets
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dataset</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead className="text-center">Registros</TableHead>
                <TableHead>Actualización</TableHead>
                <TableHead className="text-center">Descargas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {datasetsFiltrados.map((dataset) => {
                const CategoriaIcon = getCategoriaIcon(dataset.categoria);
                const FormatoIcon = getFormatoIcon(dataset.formato);
                
                return (
                  <TableRow key={dataset.id}>
                    <TableCell>
                      <div className="max-w-sm">
                        <p className="font-medium text-sm mb-1">{dataset.nombre}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {dataset.descripcion}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoriaColor(dataset.categoria)}>
                        <CategoriaIcon className="w-3 h-3 mr-1" />
                        {dataset.categoria}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <FormatoIcon className="w-4 h-4 text-muted-foreground" />
                        {dataset.formato}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {dataset.registros.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          {new Date(dataset.ultima_actualizacion).toLocaleDateString('es-MX', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <p className="text-muted-foreground">{dataset.frecuencia_actualizacion}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="text-sm font-semibold">{dataset.descargas}</div>
                      <div className="text-xs text-muted-foreground">{dataset.tamano_mb} MB</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Descargar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre Datos Abiertos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Todos los datasets están disponibles bajo licencia Open Data Commons Open Database License (ODbL).
            Pueden ser utilizados libremente para investigación, análisis, desarrollo de aplicaciones y otros fines.
          </p>
          <div className="grid md:grid-cols-3 gap-4 pt-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Actualización Continua</h4>
              <p className="text-xs text-muted-foreground">
                Los datos se actualizan según su frecuencia establecida para mantener información relevante
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">Formatos Estándar</h4>
              <p className="text-xs text-muted-foreground">
                JSON, CSV y GeoJSON para fácil integración en herramientas de análisis y visualización
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">API Disponible</h4>
              <p className="text-xs text-muted-foreground">
                Accede a los datos programáticamente mediante nuestra API REST documentada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
