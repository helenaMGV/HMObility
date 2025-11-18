// Fine Calculator Component - Calculate multiple fines total
import { useState } from "react";
import { Calculator, Plus, Trash2, DollarSign } from "lucide-react";
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
}

const fines: Fine[] = [
  { id: "1", name: "Exceso de velocidad", minCost: 1000, maxCost: 2180, article: "Art. 87 LTES" },
  { id: "2", name: "No usar cinturón", minCost: 870, maxCost: 1630, article: "Art. 69 LTES" },
  { id: "3", name: "Uso de celular", minCost: 1100, maxCost: 2100, article: "Art. 225 BIS" },
  { id: "4", name: "Circular sin placas", minCost: 2100, maxCost: 5400, article: "Art. 232 LTES" },
  { id: "5", name: "No respetar semáforo", minCost: 1600, maxCost: 3300, article: "Art. 235 LTES" },
  { id: "6", name: "No portar licencia", minCost: 1100, maxCost: 2200, article: "Art. 18 LTES" },
];

interface SelectedFine {
  fine: Fine;
  quantity: number;
}

const FineCalculator = () => {
  const [selectedFines, setSelectedFines] = useState<SelectedFine[]>([]);
  const [currentFine, setCurrentFine] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);

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
    return { minTotal, maxTotal, discountedMin, discountedMax };
  };

  const { minTotal, maxTotal, discountedMin, discountedMax } = calculateTotal();

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
