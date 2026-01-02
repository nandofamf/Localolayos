import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { DollarSign, Lock, Unlock, Printer } from "lucide-react";
import { toast } from "sonner";
import { formatCLP } from "@/lib/formatCurrency";

interface CashRegisterProps {
  todayTotal: number;
  todayCashTotal: number;
  todayCardTotal: number;
  transactionCount: number;
}

interface CashRegisterState {
  isOpen: boolean;
  openingAmount: number;
  openedAt: Date | null;
}

const formatCLPReceipt = (amount: number): string => {
  return "$" + Math.round(amount).toLocaleString("es-CL");
};

export const CashRegister = ({
  todayTotal,
  todayCashTotal,
  todayCardTotal,
  transactionCount,
}: CashRegisterProps) => {
  const [registerState, setRegisterState] = useState<CashRegisterState>(() => {
    const saved = localStorage.getItem("cashRegister");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        openedAt: parsed.openedAt ? new Date(parsed.openedAt) : null,
      };
    }
    return { isOpen: false, openingAmount: 0, openedAt: null };
  });

  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [openingAmount, setOpeningAmount] = useState("");

  const handleOpenRegister = () => {
    const amount = parseFloat(openingAmount) || 0;
    const newState = {
      isOpen: true,
      openingAmount: amount,
      openedAt: new Date(),
    };
    setRegisterState(newState);
    localStorage.setItem(
      "cashRegister",
      JSON.stringify({
        ...newState,
        openedAt: newState.openedAt.toISOString(),
      })
    );
    setShowOpenDialog(false);
    setOpeningAmount("");
    toast.success("Caja abierta correctamente");
  };

  const handleCloseRegister = (shouldPrint: boolean) => {
    if (shouldPrint) {
      printClosingReport();
    }
    const newState = { isOpen: false, openingAmount: 0, openedAt: null };
    setRegisterState(newState);
    localStorage.removeItem("cashRegister");
    setShowCloseDialog(false);
    toast.success("Caja cerrada correctamente");
  };

  const printClosingReport = () => {
    const printWindow = window.open("", "_blank", "width=300,height=600");
    if (!printWindow) {
      alert("Por favor permite las ventanas emergentes para imprimir");
      return;
    }

    const expectedCash = registerState.openingAmount + todayCashTotal;
    const now = new Date();

    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cierre de Caja</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            width: 80mm;
            max-width: 80mm;
            padding: 5mm;
            background: white;
            color: black;
          }
          .header {
            text-align: center;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 2px solid #000;
          }
          .header h1 { font-size: 16px; margin-bottom: 5px; }
          .header p { font-size: 10px; }
          .section {
            margin: 10px 0;
            padding: 10px 0;
            border-bottom: 1px dashed #000;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 13px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .total {
            font-size: 16px;
            font-weight: bold;
            text-align: center;
            margin: 15px 0;
            padding: 10px;
            border: 2px solid #000;
          }
          .footer {
            text-align: center;
            margin-top: 15px;
            font-size: 10px;
          }
          @media print { body { width: 80mm; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CIERRE DE CAJA</h1>
          <p>Olayo's</p>
          <p>Maipú 470, local 15, Concepción</p>
        </div>
        
        <div class="section">
          <div class="row">
            <span>Fecha:</span>
            <span>${now.toLocaleDateString("es-CL")}</span>
          </div>
          <div class="row">
            <span>Hora cierre:</span>
            <span>${now.toLocaleTimeString("es-CL")}</span>
          </div>
          ${
            registerState.openedAt
              ? `<div class="row">
            <span>Hora apertura:</span>
            <span>${registerState.openedAt.toLocaleTimeString("es-CL")}</span>
          </div>`
              : ""
          }
        </div>
        
        <div class="section">
          <div class="section-title">RESUMEN DE VENTAS</div>
          <div class="row">
            <span>Transacciones:</span>
            <span>${transactionCount}</span>
          </div>
          <div class="row">
            <span>Ventas efectivo:</span>
            <span>${formatCLPReceipt(todayCashTotal)}</span>
          </div>
          <div class="row">
            <span>Ventas tarjeta:</span>
            <span>${formatCLPReceipt(todayCardTotal)}</span>
          </div>
          <div class="row" style="font-weight: bold; margin-top: 10px;">
            <span>Total ventas:</span>
            <span>${formatCLPReceipt(todayTotal)}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">CAJA</div>
          <div class="row">
            <span>Fondo inicial:</span>
            <span>${formatCLPReceipt(registerState.openingAmount)}</span>
          </div>
          <div class="row">
            <span>+ Ventas efectivo:</span>
            <span>${formatCLPReceipt(todayCashTotal)}</span>
          </div>
        </div>
        
        <div class="total">
          EFECTIVO ESPERADO<br/>
          ${formatCLPReceipt(expectedCash)}
        </div>
        
        <div class="footer">
          <p>Olayo's - Sistema POS</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
  };

  return (
    <>
      <div className="flex gap-2">
        {registerState.isOpen ? (
          <Button
            variant="outline"
            onClick={() => setShowCloseDialog(true)}
            className="gap-2"
          >
            <Lock className="w-4 h-4" />
            Cerrar Caja
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => setShowOpenDialog(true)}
            className="gap-2"
          >
            <Unlock className="w-4 h-4" />
            Abrir Caja
          </Button>
        )}
      </div>

      {/* Open Register Dialog */}
      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Unlock className="w-5 h-5 text-primary" />
              Abrir Caja
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">
                Fondo inicial (efectivo en caja)
              </label>
              <div className="relative mt-1">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0"
                  value={openingAmount}
                  onChange={(e) => setOpeningAmount(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOpenDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleOpenRegister}
              className="gradient-primary text-primary-foreground"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Abrir Caja
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Register Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Cerrar Caja
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fondo inicial:</span>
                <span className="font-medium">
                  {formatCLP(registerState.openingAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ventas efectivo:</span>
                <span className="font-medium">{formatCLP(todayCashTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ventas tarjeta:</span>
                <span className="font-medium">{formatCLP(todayCardTotal)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="text-muted-foreground">Total ventas:</span>
                <span className="font-bold text-primary">
                  {formatCLP(todayTotal)}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 mt-2">
                <span className="font-semibold">Efectivo esperado:</span>
                <span className="font-bold text-lg text-primary">
                  {formatCLP(registerState.openingAmount + todayCashTotal)}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              ¿Deseas imprimir el reporte de cierre?
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleCloseRegister(false)}
              className="flex-1"
            >
              Solo cerrar
            </Button>
            <Button
              onClick={() => handleCloseRegister(true)}
              className="flex-1 gradient-primary text-primary-foreground"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir y cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
