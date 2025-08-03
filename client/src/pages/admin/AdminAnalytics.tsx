import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown, Sparkles, Zap } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useState, useEffect } from 'react';

const AdminAnalytics = () => {
  // Demo data for analytics
  const salesData = [
    { month: 'Jan', sales: 4000, orders: 240 },
    { month: 'Feb', sales: 3000, orders: 198 },
    { month: 'Mar', sales: 5000, orders: 300 },
    { month: 'Apr', sales: 4500, orders: 278 },
    { month: 'May', sales: 6000, orders: 356 },
    { month: 'Jun', sales: 5500, orders: 334 },
  ];

  const orderStatusData = [
    { name: 'Delivered', value: 45, color: 'hsl(var(--primary))' },
    { name: 'Shipped', value: 25, color: 'hsl(var(--secondary))' },
    { name: 'Processing', value: 20, color: 'hsl(var(--accent))' },
    { name: 'Cancelled', value: 10, color: 'hsl(var(--muted))' },
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 156, revenue: 15600 },
    { name: 'Smartphone Case', sales: 134, revenue: 2680 },
    { name: 'Bluetooth Speaker', sales: 98, revenue: 7840 },
    { name: 'Laptop Stand', sales: 87, revenue: 4350 },
    { name: 'USB Charger', sales: 76, revenue: 1520 },
  ];

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Animated counters
  const revenueCount = useCountUp({ end: 45231, duration: 2000, delay: 200 });
  const ordersCount = useCountUp({ end: 1234, duration: 2000, delay: 400 });
  const productsCount = useCountUp({ end: 89, duration: 2000, delay: 600 });
  const customersCount = useCountUp({ end: 2345, duration: 2000, delay: 800 });

  const metrics = [
    {
      title: 'Total Revenue',
      value: revenueCount,
      displayValue: `$${revenueCount.toLocaleString()}`,
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Total Orders',
      value: ordersCount,
      displayValue: ordersCount.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
    },
    {
      title: 'Total Products',
      value: productsCount,
      displayValue: productsCount.toString(),
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Package,
    },
    {
      title: 'Total Customers',
      value: customersCount,
      displayValue: customersCount.toLocaleString(),
      change: '-1.4%',
      changeType: 'negative' as const,
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold text-gradient-primary">Analytics Dashboard</h1>
            <Zap className="w-8 h-8 text-accent animate-bounce" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time insights and performance metrics for your e-commerce platform
          </p>
        </div>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <Card 
                key={metric.title} 
                className={`metric-card card-gradient pulse-glow ${isVisible ? 'stagger-fade-in' : ''}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-primary float-animation" 
                        style={{ animationDelay: `${index * 200}ms` }} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold counter-animation text-gradient-primary">
                    {metric.displayValue}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    {metric.changeType === 'positive' ? (
                      <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span className={metric.changeType === 'positive' ? 'text-emerald-500' : 'text-red-500'}>
                      {metric.change}
                    </span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card className={`card-gradient ${isVisible ? 'stagger-fade-in' : ''}`} 
                style={{ animationDelay: '500ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Sales Overview
              </CardTitle>
              <CardDescription>Monthly sales and order trends with beautiful visualizations</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sales: { label: 'Sales ($)', color: 'hsl(var(--primary))' },
                  orders: { label: 'Orders', color: 'hsl(var(--secondary))' },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="orders" stroke="hsl(var(--secondary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Order Status Chart */}
          <Card className={`card-gradient ${isVisible ? 'stagger-fade-in' : ''}`}
                style={{ animationDelay: '700ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-accent" />
                Order Status Distribution
              </CardTitle>
              <CardDescription>Real-time order status breakdown with interactive charts</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  delivered: { label: 'Delivered', color: 'hsl(var(--primary))' },
                  shipped: { label: 'Shipped', color: 'hsl(var(--secondary))' },
                  processing: { label: 'Processing', color: 'hsl(var(--accent))' },
                  cancelled: { label: 'Cancelled', color: 'hsl(var(--muted))' },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {orderStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {item.name}: {item.value}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products Table */}
        <Card className={`card-gradient ${isVisible ? 'stagger-fade-in' : ''}`}
              style={{ animationDelay: '900ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary-warm" />
              Top Selling Products
            </CardTitle>
            <CardDescription>Best performing products with impressive sales figures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div 
                  key={product.name} 
                  className={`flex items-center justify-between py-3 px-4 rounded-lg bg-gradient-to-r from-card/50 to-transparent border border-border/30 hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] ${isVisible ? 'stagger-fade-in' : ''}`}
                  style={{ animationDelay: `${1100 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-white font-bold shadow-lg">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gradient-primary">{product.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <ShoppingCart className="w-3 h-3" />
                        {product.sales} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gradient-secondary">
                      ${product.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;