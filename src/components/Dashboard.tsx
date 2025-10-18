import { AlertCircle, BookOpen, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Fine {
  infraccion: string;
  descripcion: string;
  ley: string;
  costo: string;
}

interface DashboardProps {
  data?: Fine[];
}

const defaultData: Fine[] = [
  {
    infraccion: "Exceso de velocidad",
    descripcion: "Conducir por encima del límite permitido",
    ley: "Art. 87 LTES",
    costo: "$1,000 - $2,180"
  },
  {
    infraccion: "No usar cinturón",
    descripcion: "Conducir sin cinturón de seguridad",
    ley: "Art. 69 LTES",
    costo: "$870 - $1,630"
  },
  {
    infraccion: "Uso de celular",
    descripcion: "Usar dispositivos móviles mientras se conduce",
    ley: "Art. 225 BIS",
    costo: "$1,100 - $2,100"
  },
  {
    infraccion: "Circular sin placas",
    descripcion: "Conducir con vehículo sin placas",
    ley: "Art. 232 LTES",
    costo: "$2,100 - $5,400"
  },
  {
    infraccion: "No respetar semáforo",
    descripcion: "Pasar en alto o luz roja",
    ley: "Art. 235 LTES",
    costo: "$1,600 - $3,300"
  },
  {
    infraccion: "No portar licencia de conducir",
    descripcion: "No contar con licencia vigente al conducir o no tenerla a la mano",
    ley: "Art. 18 LTES",
    costo: "$1,100 - $2,200"
  }
];

const Dashboard = ({ data = defaultData }: DashboardProps) => {
  return (
    <section id="tabla-multas" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Tabla de Multas de Tránsito
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Conoce las infracciones más comunes y sus costos en Hermosillo
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 animate-slide-up">
            <Card className="border-secondary/20 shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Costo Promedio</CardTitle>
                <DollarSign className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">$2,100</div>
                <p className="text-xs text-muted-foreground">por multa de tránsito</p>
              </CardContent>
            </Card>

            <Card className="border-accent/20 shadow-card hover:shadow-elegant transition-smooth">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Ley de Tránsito</CardTitle>
                <BookOpen className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">LTES</div>
                <p className="text-xs text-muted-foreground">Sonora vigente</p>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className="shadow-elegant animate-scale-in">
            <CardHeader>
              <CardTitle>Infracciones Registradas</CardTitle>
              <CardDescription>
                Información detallada sobre multas y sus fundamentos legales
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-card">
                    <TableHead className="font-bold">Infracción</TableHead>
                    <TableHead className="font-bold">Descripción</TableHead>
                    <TableHead className="font-bold">Fundamento Legal</TableHead>
                    <TableHead className="font-bold text-right">Costo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((fine, index) => (
                    <TableRow 
                      key={index} 
                      className="hover:bg-muted/50 transition-smooth"
                    >
                      <TableCell className="font-medium text-primary">
                        {fine.infraccion}
                      </TableCell>
                      <TableCell className="text-sm">
                        {fine.descripcion}
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {fine.ley}
                      </TableCell>
                      <TableCell className="text-right font-bold text-secondary">
                        {fine.costo}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
