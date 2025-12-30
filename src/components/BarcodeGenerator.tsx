import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Barcode, Copy, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface BarcodeGeneratorProps {
  initialValue?: string;
  onBarcodeGenerated?: (barcode: string) => void;
}

export const BarcodeGenerator = ({ initialValue = "", onBarcodeGenerated }: BarcodeGeneratorProps) => {
  const [barcodeValue, setBarcodeValue] = useState(initialValue);
  const svgRef = useRef<SVGSVGElement>(null);

  const generateRandomBarcode = () => {
    // Generate a random 12-digit EAN-13 compatible number
    const randomDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
    setBarcodeValue(randomDigits);
    onBarcodeGenerated?.(randomDigits);
  };

  useEffect(() => {
    if (barcodeValue && svgRef.current) {
      try {
        JsBarcode(svgRef.current, barcodeValue, {
          format: "CODE128",
          lineColor: "#000",
          width: 2,
          height: 80,
          displayValue: true,
          fontSize: 14,
          margin: 10,
        });
      } catch {
        // Invalid barcode format
      }
    }
  }, [barcodeValue]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(barcodeValue);
    toast.success("Código copiado al portapapeles");
  };

  const downloadBarcode = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `barcode-${barcodeValue}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      toast.success("Código de barras descargado");
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Barcode className="w-5 h-5 text-primary" />
          </div>
          Generador de Código de Barras
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Ingresa o genera un código"
            value={barcodeValue}
            onChange={(e) => {
              setBarcodeValue(e.target.value);
              onBarcodeGenerated?.(e.target.value);
            }}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={generateRandomBarcode}
            title="Generar código aleatorio"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {barcodeValue && (
          <div className="flex flex-col items-center gap-4 p-4 bg-background rounded-lg border border-border">
            <svg ref={svgRef} className="max-w-full" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
              <Button variant="outline" size="sm" onClick={downloadBarcode}>
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </div>
          </div>
        )}

        {!barcodeValue && (
          <div className="text-center py-8 text-muted-foreground">
            <Barcode className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Ingresa un código o genera uno aleatorio</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
