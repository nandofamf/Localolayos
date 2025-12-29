import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, Save } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { CATEGORIES } from "@/types";
import { toast } from "sonner";

const AgregarProducto = () => {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "Abarrotes",
    minStock: "5",
    barcode: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.stock) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    setLoading(true);
    try {
      await addProduct({
        name: form.name,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        category: form.category,
        minStock: parseInt(form.minStock) || 5,
        barcode: form.barcode || undefined,
      });
      toast.success("Producto agregado correctamente");
      navigate("/productos");
    } catch (error) {
      toast.error("Error al agregar el producto");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Agregar Producto</h1>
          <p className="text-muted-foreground">Agrega un nuevo producto al inventario</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              Información del Producto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground">
                  Nombre del producto *
                </label>
                <Input
                  placeholder="Ej: Coca Cola 500ml"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Precio *</label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Stock inicial *</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => handleChange("stock", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Categoría</label>
                  <select
                    className="w-full h-10 mt-1 rounded-md border border-input bg-background px-3 text-sm"
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                  >
                    {CATEGORIES.filter((c) => c !== "Todos").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Stock mínimo</label>
                  <Input
                    type="number"
                    placeholder="5"
                    value={form.minStock}
                    onChange={(e) => handleChange("minStock", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">
                  Código de barras (opcional)
                </label>
                <Input
                  placeholder="Escanea o escribe el código"
                  value={form.barcode}
                  onChange={(e) => handleChange("barcode", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/productos")}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 gradient-primary text-primary-foreground hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Producto
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Add Multiple */}
        <Card className="shadow-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="w-5 h-5 text-primary" />
              Agregar rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Después de guardar, puedes agregar otro producto rápidamente.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setForm({
                  name: "",
                  price: "",
                  stock: "",
                  category: "Abarrotes",
                  minStock: "5",
                  barcode: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Limpiar formulario
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AgregarProducto;
