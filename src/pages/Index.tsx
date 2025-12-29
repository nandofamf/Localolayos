import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ShoppingCart, Receipt, AlertTriangle, Package } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useSales } from "@/hooks/useSales";

const Dashboard = () => {
  const { products, getLowStockProducts } = useProducts();
  const { getTodayTotal, getTodayTransactions, getAverageTicket, getTodaySales } = useSales();

  const todayTotal = getTodayTotal();
  const transactions = getTodayTransactions();
  const averageTicket = getAverageTicket();
  const lowStockProducts = getLowStockProducts();
  const todaySales = getTodaySales();

  const stats = [
    {
      title: "Ventas Hoy",
      value: `$${todayTotal.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-secondary",
    },
    {
      title: "Transacciones",
      value: transactions.toString(),
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-secondary",
    },
    {
      title: "Ticket Promedio",
      value: `$${averageTicket.toFixed(2)}`,
      icon: Receipt,
      color: "text-primary",
      bgColor: "bg-secondary",
    },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de tu tienda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card hover:shadow-card-hover transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Stock Bajo
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {lowStockProducts.length} producto(s) necesitan reposición
              </p>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay productos con stock bajo
                </p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                          <Package className="w-4 h-4 text-warning" />
                        </div>
                        <span className="font-medium text-foreground">{product.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-warning font-semibold">{product.stock}</span>
                        <span className="text-muted-foreground text-sm"> / {product.minStock} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Receipt className="w-5 h-5 text-primary" />
                Ventas del Día
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {transactions} transacciones hoy
              </p>
            </CardHeader>
            <CardContent>
              {todaySales.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No hay ventas hoy
                </p>
              ) : (
                <div className="space-y-3">
                  {todaySales.slice(0, 5).map((sale) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {sale.items.length} productos
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(sale.date).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span className="text-primary font-bold text-lg">
                        ${sale.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Products Summary */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="w-5 h-5 text-primary" />
              Inventario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-secondary text-center">
                <p className="text-2xl font-bold text-primary">{products.length}</p>
                <p className="text-sm text-muted-foreground">Total Productos</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 text-center">
                <p className="text-2xl font-bold text-warning">{lowStockProducts.length}</p>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary text-center">
                <p className="text-2xl font-bold text-primary">
                  {products.filter(p => p.stock > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Con Stock</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 text-center">
                <p className="text-2xl font-bold text-destructive">
                  {products.filter(p => p.stock === 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Sin Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
