import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Megaphone, 
  Plus, 
  Edit2, 
  Trash2,
  Calendar,
  Users,
  Target,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface Campana {
  id: string;
  nombre: string;
  tipo: 'prevencion' | 'educacion' | 'enforcement' | 'infraestructura';
  descripcion: string;
  objetivo: string;
  zona_objetivo: string;
  publico_objetivo: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: 'planificacion' | 'activa' | 'finalizada' | 'pausada';
  alcance_estimado: number;
  presupuesto: number;
  indicadores: {
    accidentes_antes: number;
    accidentes_despues: number;
    participacion: number;
  };
}

export default function CampaignsModule() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampana, setEditingCampana] = useState<Campana | null>(null);
  
  const [campanas, setCampanas] = useState<Campana[]>([
    {
      id: 'CAM-001',
      nombre: 'Respeta Límites de Velocidad',
      tipo: 'prevencion',
      descripcion: 'Campaña de concientización sobre respeto a límites de velocidad en zonas escolares',
      objetivo: 'Reducir 30% los excesos de velocidad en zonas escolares',
      zona_objetivo: 'Zonas Escolares Hermosillo',
      publico_objetivo: 'Conductores en horarios escolares',
      fecha_inicio: '2025-11-01',
      fecha_fin: '2025-12-31',
      estado: 'activa',
      alcance_estimado: 50000,
      presupuesto: 150000,
      indicadores: {
        accidentes_antes: 12,
        accidentes_despues: 8,
        participacion: 65,
      },
    },
    {
      id: 'CAM-002',
      nombre: 'Cruces Seguros',
      tipo: 'educacion',
      descripcion: 'Educación vial para peatones sobre uso correcto de cruces peatonales',
      objetivo: 'Aumentar 50% el uso de cruces señalizados',
      zona_objetivo: 'Centro Hermosillo',
      publico_objetivo: 'Peatones de todas las edades',
      fecha_inicio: '2025-10-15',
      fecha_fin: '2025-11-30',
      estado: 'activa',
      alcance_estimado: 30000,
      presupuesto: 80000,
      indicadores: {
        accidentes_antes: 8,
        accidentes_despues: 5,
        participacion: 45,
      },
    },
    {
      id: 'CAM-003',
      nombre: 'Cero Alcohol al Volante',
      tipo: 'enforcement',
      descripcion: 'Operativos y concientización sobre conducir bajo efectos del alcohol',
      objetivo: 'Reducir 40% los accidentes relacionados con alcohol',
      zona_objetivo: 'Corredores nocturnos',
      publico_objetivo: 'Conductores nocturnos (20:00-04:00)',
      fecha_inicio: '2025-09-01',
      fecha_fin: '2025-11-15',
      estado: 'finalizada',
      alcance_estimado: 80000,
      presupuesto: 200000,
      indicadores: {
        accidentes_antes: 24,
        accidentes_despues: 14,
        participacion: 78,
      },
    },
    {
      id: 'CAM-004',
      nombre: 'Infraestructura Ciclista Segura',
      tipo: 'infraestructura',
      descripcion: 'Campaña de promoción e inauguración de nuevas ciclovías protegidas',
      objetivo: 'Incrementar 25% el uso de bicicleta como medio de transporte',
      zona_objetivo: 'Av. Solidaridad - Blvd. Colosio',
      publico_objetivo: 'Ciclistas y potenciales usuarios',
      fecha_inicio: '2025-12-01',
      fecha_fin: '2026-02-28',
      estado: 'planificacion',
      alcance_estimado: 15000,
      presupuesto: 300000,
      indicadores: {
        accidentes_antes: 6,
        accidentes_despues: 0,
        participacion: 0,
      },
    },
  ]);

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      prevencion: 'Prevención',
      educacion: 'Educación',
      enforcement: 'Enforcement',
      infraestructura: 'Infraestructura',
    };
    return labels[tipo] || tipo;
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'prevencion': return 'default';
      case 'educacion': return 'secondary';
      case 'enforcement': return 'destructive';
      case 'infraestructura': return 'outline';
      default: return 'outline';
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activa': return { variant: 'default' as const, className: 'bg-primary text-primary-foreground' };
      case 'finalizada': return { variant: 'outline' as const, className: 'bg-muted text-muted-foreground' };
      case 'planificacion': return { variant: 'secondary' as const, className: '' };
      case 'pausada': return { variant: 'destructive' as const, className: '' };
      default: return { variant: 'outline' as const, className: '' };
    }
  };

  const calcularEfectividad = (antes: number, despues: number) => {
    if (antes === 0) return 0;
    return Math.round(((antes - despues) / antes) * 100);
  };

  const handleDelete = (id: string) => {
    setCampanas(campanas.filter(c => c.id !== id));
  };

  const totalPresupuesto = campanas.reduce((sum, c) => sum + c.presupuesto, 0);
  const campanasActivas = campanas.filter(c => c.estado === 'activa').length;
  const alcanceTotal = campanas
    .filter(c => c.estado === 'activa')
    .reduce((sum, c) => sum + c.alcance_estimado, 0);
  const efectividadPromedio = Math.round(
    campanas
      .filter(c => c.indicadores.accidentes_antes > 0)
      .reduce((sum, c) => sum + calcularEfectividad(c.indicadores.accidentes_antes, c.indicadores.accidentes_despues), 0) / 
    campanas.filter(c => c.indicadores.accidentes_antes > 0).length
  );

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Campañas Activas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{campanasActivas}</div>
            <p className="text-xs text-primary">En ejecución</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alcance Estimado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(alcanceTotal / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Personas impactadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Presupuesto Total</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalPresupuesto / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Inversión anual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Efectividad Promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{efectividadPromedio}%</div>
            <p className="text-xs text-primary">Reducción accidentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Campaigns Table */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  Gestión de Campañas
                </CardTitle>
                <CardDescription>Campañas de seguridad vial y prevención</CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setEditingCampana(null)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Campaña
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCampana ? 'Editar Campaña' : 'Nueva Campaña'}
                    </DialogTitle>
                    <DialogDescription>
                      Configura los detalles de la campaña de seguridad vial
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre de la Campaña</Label>
                        <Input placeholder="Ej: Respeta al Peatón" />
                      </div>
                      <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select defaultValue="prevencion">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prevencion">Prevención</SelectItem>
                            <SelectItem value="educacion">Educación</SelectItem>
                            <SelectItem value="enforcement">Enforcement</SelectItem>
                            <SelectItem value="infraestructura">Infraestructura</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Textarea placeholder="Describe el objetivo y alcance de la campaña..." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Zona Objetivo</Label>
                        <Input placeholder="Ej: Centro Hermosillo" />
                      </div>
                      <div className="space-y-2">
                        <Label>Público Objetivo</Label>
                        <Input placeholder="Ej: Conductores" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Fecha Inicio</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Fecha Fin</Label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Alcance Estimado</Label>
                        <Input type="number" placeholder="Número de personas" />
                      </div>
                      <div className="space-y-2">
                        <Label>Presupuesto (MXN)</Label>
                        <Input type="number" placeholder="150000" />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setDialogOpen(false)}>
                      {editingCampana ? 'Guardar Cambios' : 'Crear Campaña'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaña</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Periodo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Efectividad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campanas.map((campana) => {
                  const estadoBadge = getEstadoBadge(campana.estado);
                  const efectividad = calcularEfectividad(
                    campana.indicadores.accidentes_antes,
                    campana.indicadores.accidentes_despues
                  );
                  
                  return (
                    <TableRow key={campana.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{campana.nombre}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {campana.zona_objetivo}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTipoBadge(campana.tipo)}>
                          {getTipoLabel(campana.tipo)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p>{new Date(campana.fecha_inicio).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}</p>
                          <p className="text-muted-foreground">
                            {new Date(campana.fecha_fin).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={estadoBadge.variant}
                          className={estadoBadge.className}
                        >
                          {campana.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {campana.estado !== 'planificacion' && (
                          <div className="text-sm">
                            <span className={efectividad > 0 ? 'text-primary font-semibold' : 'text-muted-foreground'}>
                              {efectividad > 0 ? `-${efectividad}%` : 'N/A'}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingCampana(campana);
                              setDialogOpen(true);
                            }}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(campana.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Stats & Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Indicadores Clave
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Active Campaigns */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Campañas Activas
              </h4>
              <div className="space-y-2">
                {campanas
                  .filter(c => c.estado === 'activa')
                  .map((campana) => (
                    <div
                      key={campana.id}
                      className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium text-sm mb-1">{campana.nombre}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {(campana.alcance_estimado / 1000).toFixed(0)}K
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {campana.indicadores.participacion}% alcance
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* In Planning */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-secondary-foreground" />
                En Planificación
              </h4>
              <div className="space-y-2">
                {campanas
                  .filter(c => c.estado === 'planificacion')
                  .map((campana) => (
                    <div
                      key={campana.id}
                      className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                    >
                      <p className="font-medium text-sm mb-1">{campana.nombre}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Inicio: {new Date(campana.fecha_inicio).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold mb-3">Recomendaciones</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• Aumentar campañas de educación vial en zonas escolares</p>
                <p>• Evaluar expansión de campañas con mayor efectividad</p>
                <p>• Considerar campañas multimodales (digital + presencial)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
