import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Search, Package, Plus, Minus, Trash2, ShoppingCart, Printer } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";
import { useCart } from "@/hooks/useCart";
import { CATEGORIES } from "@/types";
import { toast } from "sonner";
import { printReceipt } from "@/components/ReceiptPrinter";
import { formatCLP } from "@/lib/formatCurrency";

const POS = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const { products, updateProduct } = useProducts();
  const { addSale } = useSales();
  const { items, addToCart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: typeof products[0]) => {
    if (product.stock <= 0) {
      toast.error("Producto sin stock");
      return;
    }
    const cartItem = items.find((i) => i.id === product.id);
    if (cartItem && cartItem.quantity >= product.stock) {
      toast.error("No hay suficiente stock");
      return;
    }
    addToCart(product);
  };

  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [lastSaleId, setLastSaleId] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    try {
      // Update stock for each product
      for (const item of items) {
        const product = products.find((p) => p.id === item.id);
        if (product) {
          await updateProduct(item.id, { stock: product.stock - item.quantity });
        }
      }

      // Register sale
      const saleId = await addSale(items, getTotal(), "efectivo");
      setLastSaleId(saleId);
      
      // Show print dialog
      setShowPrintDialog(true);
      toast.success("¡Venta completada!");
    } catch (error) {
      toast.error("Error al procesar la venta");
    }
  };

  const handlePrintAndClose = () => {
    printReceipt({
      items,
      total: getTotal(),
      paymentMethod: "efectivo",
      date: new Date(),
      saleId: lastSaleId || undefined,
    });
    clearCart();
    setShowPrintDialog(false);
    setLastSaleId(null);
  };

  const handleCloseWithoutPrint = () => {
    clearCart();
    setShowPrintDialog(false);
    setLastSaleId(null);
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
        {/* Products Section */}
        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Punto de Venta</h1>
            <p className="text-muted-foreground">Selecciona productos para agregar al carrito</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar producto o escanear código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const isLowStock = product.stock <= product.minStock;
              return (
                <Card
                  key={product.id}
                  className={`shadow-card hover:shadow-card-hover transition-all cursor-pointer ${
                    isLowStock ? "border-warning" : ""
                  }`}
                  onClick={() => handleAddToCart(product)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      {isLowStock && (
                        <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning font-medium">
                          ⚠ Bajo
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                    <p className="text-lg font-bold text-primary mt-2">{formatCLP(product.price)}</p>
                  </CardContent>
                </Card>
              );
            })}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No se encontraron productos</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-full lg:w-80 xl:w-96">
          <Card className="shadow-card sticky top-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="w-5 h-5 text-foreground" />
                <h2 className="font-semibold text-lg text-foreground">
                  Carrito ({items.length})
                </h2>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">El carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground line-clamp-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatCLP(item.price)} c/u
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-foreground">
                            {formatCLP(item.price * item.quantity)}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border mt-4 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold text-foreground">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatCLP(getTotal())}
                      </span>
                    </div>
                    <Button
                      className="w-full h-12 text-lg gradient-primary text-primary-foreground hover:opacity-90"
                      onClick={handleCheckout}
                    >
                      Cobrar
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Print Dialog */}
      <Dialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Printer className="w-5 h-5 text-primary" />
              ¡Venta Completada!
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-3xl font-bold text-primary mb-2">{formatCLP(getTotal())}</p>
            <p className="text-muted-foreground">¿Deseas imprimir el ticket?</p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleCloseWithoutPrint} className="flex-1">
              No imprimir
            </Button>
            <Button onClick={handlePrintAndClose} className="flex-1 gradient-primary text-primary-foreground">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default POS;
