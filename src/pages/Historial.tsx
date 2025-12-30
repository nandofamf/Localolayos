import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Receipt, Calendar, Package } from "lucide-react";
import { useSales } from "@/hooks/useSales";
import { formatCLP } from "@/lib/formatCurrency";

const Historial = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const { sales, loading } = useSales();

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = sale.items.some((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesDate = !dateFilter || sale.date.startsWith(dateFilter);
    return matchesSearch && matchesDate;
  });

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Historial de Ventas</h1>
          <p className="text-muted-foreground">Consulta todas las ventas realizadas</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Ventas</p>
                  <p className="text-2xl font-bold text-foreground">{filteredSales.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Productos Vendidos</p>
                  <p className="text-2xl font-bold text-foreground">
                    {filteredSales.reduce(
                      (sum, sale) =>
                        sum + sale.items.reduce((iSum, item) => iSum + item.quantity, 0),
                      0
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-primary text-xl font-bold">$</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-primary">{formatCLP(totalRevenue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 w-full sm:w-48"
            />
          </div>
          {(searchQuery || dateFilter) && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setDateFilter("");
              }}
            >
              Limpiar
            </Button>
          )}
        </div>

        {/* Sales List */}
        <div className="space-y-4">
          {filteredSales.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center">
                <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No se encontraron ventas</p>
              </CardContent>
            </Card>
          ) : (
            filteredSales.map((sale) => (
              <Card key={sale.id} className="shadow-card hover:shadow-card-hover transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                        <Receipt className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          Venta #{sale.id.slice(-6).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {new Date(sale.date).toLocaleDateString("es-ES", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">{formatCLP(sale.total)}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {sale.paymentMethod}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 pt-2 border-t border-border">
                    {sale.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm py-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <span className="text-foreground">{item.name}</span>
                        </div>
                        <span className="text-muted-foreground">
                          {formatCLP(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Historial;
