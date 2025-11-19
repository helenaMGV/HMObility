// Fine Calculator Component - Calculate multiple fines total
import { useState, useEffect } from "react";
import { Calculator, Plus, Trash2, DollarSign, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Fine {
  id: string;
  name: string;
  minCost: number;
  maxCost: number;
  article: string;
  puntos_licencia?: number;
  gravedad?: string;
  suspension_dias?: number;
}

interface SancionData {
  articulo_id: string;
  articulo: string;
  descripcion: string;
  multa_base: number;
  puntos_licencia: number;
  gravedad: string;
  suspension_dias: number;
}

const defaultFines: Fine[] = [
  { id: "1", name: "Exceso de velocidad", minCost: 1000, maxCost: 2180, article: "Art. 87 LTES", puntos_licencia: 6, gravedad: "alta" },
  { id: "2", name: "No usar cinturón", minCost: 870, maxCost: 1630, article: "Art. 69 LTES", puntos_licencia: 3, gravedad: "media" },
  { id: "3", name: "Uso de celular", minCost: 1100, maxCost: 2100, article: "Art. 225 BIS", puntos_licencia: 4, gravedad: "media" },
  { id: "4", name: "Circular sin placas", minCost: 2100, maxCost: 5400, article: "Art. 232 LTES", puntos_licencia: 5, gravedad: "alta" },
  { id: "5", name: "No respetar semáforo", minCost: 1600, maxCost: 3300, article: "Art. 235 LTES", puntos_licencia: 7, gravedad: "muy_alta" },
  { id: "6", name: "No portar licencia", minCost: 1100, maxCost: 2200, article: "Art. 18 LTES", puntos_licencia: 2, gravedad: "baja" },
];

interface SelectedFine {
  fine: Fine;
  quantity: number;
}

const FineCalculator = () => {
  const [fines, setFines] = useState<Fine[]>(defaultFines);
  const [selectedFines, setSelectedFines] = useState<SelectedFine[]>([]);
  const [currentFine, setCurrentFine] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

  useEffect(() => {
    // Cargar datos de sanciones desde el JSON
    fetch("/src/data/sanciones_puntos.json")
      .then(res => res.json())
      .then((data: SancionData[]) => {
        const loadedFines = data.map((sancion, idx) => ({
          id: sancion.articulo_id || `sancion_${idx}`,
          name: sancion.descripcion,
          minCost: sancion.multa_base * 0.8,
          maxCost: sancion.multa_base,
          article: sancion.articulo,
          puntos_licencia: sancion.puntos_licencia,
          gravedad: sancion.gravedad,
          suspension_dias: sancion.suspension_dias
        }));
        setFines(loadedFines);
      })
      .catch(err => {
        console.error("Error cargando sanciones:", err);
        // Mantener fines por defecto
      });
  }, []);

  const addFine = () => {
    if (!currentFine) {
      toast.error("Selecciona una infracción");
      return;
    }

    const fine = fines.find(f => f.id === currentFine);
    if (!fine) return;

    const existing = selectedFines.find(sf => sf.fine.id === currentFine);
    if (existing) {
      setSelectedFines(selectedFines.map(sf => 
        sf.fine.id === currentFine ? { ...sf, quantity: sf.quantity + 1 } : sf
      ));
    } else {
      setSelectedFines([...selectedFines, { fine, quantity: 1 }]);
    }

    setCurrentFine("");
    toast.success(`${fine.name} agregada`);
  };

  const removeFine = (id: string) => {
    setSelectedFines(selectedFines.filter(sf => sf.fine.id !== id));
    toast.info("Infracción eliminada");
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFine(id);
      return;
    }
    setSelectedFines(selectedFines.map(sf => 
      sf.fine.id === id ? { ...sf, quantity } : sf
    ));
  };

  const calculateTotal = () => {
    const minTotal = selectedFines.reduce((sum, sf) => sum + (sf.fine.minCost * sf.quantity), 0);
    const maxTotal = selectedFines.reduce((sum, sf) => sum + (sf.fine.maxCost * sf.quantity), 0);
    const discountedMin = minTotal * (1 - discount / 100);
    const discountedMax = maxTotal * (1 - discount / 100);
    const totalPuntos = selectedFines.reduce((sum, sf) => sum + ((sf.fine.puntos_licencia || 0) * sf.quantity), 0);
    const tieneSuspension = selectedFines.some(sf => (sf.fine.suspension_dias || 0) > 0);
    const diasSuspension = selectedFines.reduce((max, sf) => Math.max(max, sf.fine.suspension_dias || 0), 0);
    return { minTotal, maxTotal, discountedMin, discountedMax, totalPuntos, tieneSuspension, diasSuspension };
  };

  const { minTotal, maxTotal, discountedMin, discountedMax, totalPuntos, tieneSuspension, diasSuspension } = calculateTotal();

  const reset = () => {
    setSelectedFines([]);
    setDiscount(0);
    toast.info("Calculadora reiniciada");
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          <CardTitle>Calculadora de Multas</CardTitle>
        </div>
        <CardDescription>
          Calcula el costo total de múltiples infracciones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Fine */}
        <div className="flex gap-2">
          <Select value={currentFine} onValueChange={setCurrentFine}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Selecciona una infracción..." />
            </SelectTrigger>
            <SelectContent>
              {fines.map(fine => (
                <SelectItem key={fine.id} value={fine.id}>
                  {fine.name} - ${fine.minCost.toLocaleString()} - ${fine.maxCost.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={addFine} size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Selected Fines List */}
        {selectedFines.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Infracciones seleccionadas:</h4>
            {selectedFines.map(sf => (
              <div key={sf.fine.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{sf.fine.name}</div>
                  <div className="text-xs text-muted-foreground">{sf.fine.article}</div>
                </div>
                <Input
                  type="number"
                  min="1"
                  value={sf.quantity}
                  onChange={(e) => updateQuantity(sf.fine.id, parseInt(e.target.value) || 0)}
                  className="w-16 text-center"
                />
                <Badge variant="secondary">
                  ${(sf.fine.minCost * sf.quantity).toLocaleString()} - ${(sf.fine.maxCost * sf.quantity).toLocaleString()}
                </Badge>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFine(sf.fine.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Discount */}
        {selectedFines.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Descuento por pago inmediato (%):</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
              placeholder="0"
            />
          </div>
        )}

        {/* Total */}
        {selectedFines.length > 0 && (
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rango total (sin descuento):</span>
                <span className="font-bold">${minTotal.toLocaleString()} - ${maxTotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Con descuento del {discount}%:</span>
                  <span className="font-bold text-green-600">
                    ${Math.round(discountedMin).toLocaleString()} - ${Math.round(discountedMax).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="font-semibold flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Total a pagar (estimado):
                </span>
                <span className="text-2xl font-bold text-primary">
                  ${Math.round(discount > 0 ? discountedMax : maxTotal).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Puntos de licencia */}
            <div className={`p-4 rounded-lg border-2 ${totalPuntos >= 12 ? 'bg-red-50 border-red-500' : totalPuntos >= 8 ? 'bg-orange-50 border-orange-500' : 'bg-yellow-50 border-yellow-500'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${totalPuntos >= 12 ? 'text-red-600' : totalPuntos >= 8 ? 'text-orange-600' : 'text-yellow-600'}`} />
                  <span className="font-semibold">Puntos de Licencia Perdidos:</span>
                </div>
                <span className={`text-2xl font-bold ${totalPuntos >= 12 ? 'text-red-600' : totalPuntos >= 8 ? 'text-orange-600' : 'text-yellow-600'}`}>
                  {totalPuntos}
                </span>
              </div>
              {totalPuntos >= 12 && (
                <div className="mt-2 text-sm text-red-700 font-semibold">
                  ⚠️ ALERTA: Con 12 o más puntos, tu licencia podría ser suspendida
                </div>
              )}
              {totalPuntos >= 8 && totalPuntos < 12 && (
                <div className="mt-2 text-sm text-orange-700">
                  ⚠️ Advertencia: Te acercas al límite de puntos permitidos
                </div>
              )}
              {tieneSuspension && diasSuspension > 0 && (
                <div className="mt-2 text-sm text-red-700 font-semibold">
                  🚫 Suspensión de licencia: {diasSuspension} días
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {selectedFines.length > 0 && (
          <Button onClick={reset} variant="outline" className="w-full">
            Reiniciar Calculadora
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default FineCalculator;
