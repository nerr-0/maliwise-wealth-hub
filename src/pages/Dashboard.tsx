import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line 
} from "recharts";
import { 
  Wallet, TrendingUp, PieChart as PieChartIcon, DollarSign,
  ArrowUpRight, ArrowDownRight, Plus, Settings, Bell,
  Building2, Landmark, Users, FileText, CreditCard
} from "lucide-react";

const portfolioData = [
  { month: "Jan", value: 2200000, growth: 5.2 },
  { month: "Feb", value: 2350000, growth: 6.8 },
  { month: "Mar", value: 2280000, growth: -3.0 },
  { month: "Apr", value: 2450000, growth: 7.5 },
  { month: "May", value: 2520000, growth: 2.9 },
  { month: "Jun", value: 2650000, growth: 5.2 }
];

const assetAllocation = [
  { name: "Stocks", value: 45, amount: 1192500, color: "hsl(var(--primary))" },
  { name: "Bonds", value: 25, amount: 662500, color: "hsl(var(--accent))" },
  { name: "REITs", value: 15, amount: 397500, color: "hsl(var(--chart-3))" },
  { name: "MMF", value: 10, amount: 265000, color: "hsl(var(--chart-4))" },
  { name: "Chama/SACCO", value: 5, amount: 132500, color: "hsl(var(--chart-5))" }
];

const recentTransactions = [
  { id: 1, type: "Buy", asset: "Safaricom PLC", amount: 85000, date: "2024-01-25", status: "completed" },
  { id: 2, type: "Sell", asset: "Equity Bank", amount: 45000, date: "2024-01-24", status: "completed" },
  { id: 3, type: "Dividend", asset: "KCB Group", amount: 12500, date: "2024-01-23", status: "completed" },
  { id: 4, type: "Buy", asset: "ILAM Fahari I-REIT", amount: 50000, date: "2024-01-22", status: "pending" }
];

const topPerformers = [
  { name: "Safaricom PLC", change: 15.2, value: 285000 },
  { name: "Equity Bank", change: 12.8, value: 195000 },
  { name: "KCB Group", change: 8.5, value: 165000 },
  { name: "EABL", change: 6.2, value: 120000 }
];

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6M");

  const chartConfig = {
    value: {
      label: "Portfolio Value",
      color: "hsl(var(--primary))",
    },
    growth: {
      label: "Growth %",
      color: "hsl(var(--accent))",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Portfolio Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, manage your investments</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div className="flex items-center text-success text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Portfolio</p>
                <p className="text-2xl font-bold">KSH 2,650,000</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-accent" />
                </div>
                <div className="flex items-center text-success text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +5.2%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Monthly Growth</p>
                <p className="text-2xl font-bold">KSH 130,000</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <PieChartIcon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">24 active</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Investments</p>
                <p className="text-2xl font-bold">6 Asset Classes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-accent" />
                </div>
                <div className="flex items-center text-success text-sm">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +8.3%
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">This Year</p>
                <p className="text-2xl font-bold">KSH 320,000</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Portfolio Performance Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Portfolio Performance</CardTitle>
                  <div className="flex space-x-2">
                    {["1M", "3M", "6M", "1Y", "ALL"].map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                        className="text-xs"
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={portfolioData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis 
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        className="text-xs"
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Asset Allocation */}
          <div>
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Asset Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {assetAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={({ payload }) => {
                          if (payload && payload[0]) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card p-3 rounded-lg shadow-lg border">
                                <p className="font-medium">{data.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {data.value}% • KSH {data.amount.toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {assetAllocation.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Transactions */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Transactions</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'Buy' ? 'bg-accent/10' :
                        transaction.type === 'Sell' ? 'bg-destructive/10' :
                        'bg-primary/10'
                      }`}>
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.asset}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.type} • {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium text-sm ${
                        transaction.type === 'Buy' ? 'text-destructive' :
                        'text-success'
                      }`}>
                        {transaction.type === 'Buy' ? '-' : '+'}KSH {transaction.amount.toLocaleString()}
                      </p>
                      <p className={`text-xs ${
                        transaction.status === 'completed' ? 'text-success' : 'text-warning'
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{performer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        KSH {performer.value.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center text-success text-sm">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      +{performer.change}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kenyan Financial Platforms Integration */}
        <div className="mt-8">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Kenyan Financial Platform Integrations</CardTitle>
              <p className="text-sm text-muted-foreground">
                Connect your accounts from various Kenyan financial institutions
              </p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="brokers" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="brokers">Stock Brokers</TabsTrigger>
                  <TabsTrigger value="reits">REITs</TabsTrigger>
                  <TabsTrigger value="chamas">Chamas</TabsTrigger>
                  <TabsTrigger value="saccos">SACCOs</TabsTrigger>
                  <TabsTrigger value="bonds">Bonds & Bills</TabsTrigger>
                </TabsList>
                
                <TabsContent value="brokers" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "Standard Investment Bank", connected: true, accounts: 2 },
                      { name: "Dyer & Blair", connected: false, accounts: 0 },
                      { name: "Genghis Capital", connected: true, accounts: 1 },
                      { name: "AIB-AXYS Africa", connected: false, accounts: 0 },
                      { name: "Kestrel Capital", connected: false, accounts: 0 },
                      { name: "Sterling Capital", connected: true, accounts: 1 }
                    ].map((broker, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-background/50">
                        <div className="flex items-center justify-between mb-3">
                          <Building2 className="w-5 h-5 text-primary" />
                          <div className={`w-2 h-2 rounded-full ${broker.connected ? 'bg-success' : 'bg-muted'}`} />
                        </div>
                        <h3 className="font-medium text-sm mb-2">{broker.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          {broker.connected ? `${broker.accounts} accounts connected` : 'Not connected'}
                        </p>
                        <Button 
                          size="sm" 
                          variant={broker.connected ? "outline" : "default"}
                          className="w-full"
                        >
                          {broker.connected ? 'Manage' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="reits" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "ILAM Fahari I-REIT", connected: true, units: 1500 },
                      { name: "Acorn D-REIT", connected: false, units: 0 },
                      { name: "Laptop & Computer I-REIT", connected: true, units: 800 },
                      { name: "Kenya mortgage refinancing", connected: false, units: 0 }
                    ].map((reit, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-background/50">
                        <div className="flex items-center justify-between mb-3">
                          <Landmark className="w-5 h-5 text-accent" />
                          <div className={`w-2 h-2 rounded-full ${reit.connected ? 'bg-success' : 'bg-muted'}`} />
                        </div>
                        <h3 className="font-medium text-sm mb-2">{reit.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          {reit.connected ? `${reit.units} units` : 'Not connected'}
                        </p>
                        <Button 
                          size="sm" 
                          variant={reit.connected ? "outline" : "default"}
                          className="w-full"
                        >
                          {reit.connected ? 'Manage' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="chamas" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "Investment Chama Plus", connected: true, contribution: 25000 },
                      { name: "Kiama Progressive Group", connected: true, contribution: 15000 },
                      { name: "Nairobi Investment Club", connected: false, contribution: 0 }
                    ].map((chama, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-background/50">
                        <div className="flex items-center justify-between mb-3">
                          <Users className="w-5 h-5 text-primary" />
                          <div className={`w-2 h-2 rounded-full ${chama.connected ? 'bg-success' : 'bg-muted'}`} />
                        </div>
                        <h3 className="font-medium text-sm mb-2">{chama.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          {chama.connected ? `Monthly: KSH ${chama.contribution.toLocaleString()}` : 'Not connected'}
                        </p>
                        <Button 
                          size="sm" 
                          variant={chama.connected ? "outline" : "default"}
                          className="w-full"
                        >
                          {chama.connected ? 'Manage' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="saccos" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "Kenya Police SACCO", connected: true, shares: 45000 },
                      { name: "Mwalimu National SACCO", connected: false, shares: 0 },
                      { name: "Unaitas SACCO", connected: true, shares: 28000 },
                      { name: "Stima SACCO", connected: false, shares: 0 }
                    ].map((sacco, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-background/50">
                        <div className="flex items-center justify-between mb-3">
                          <Building2 className="w-5 h-5 text-accent" />
                          <div className={`w-2 h-2 rounded-full ${sacco.connected ? 'bg-success' : 'bg-muted'}`} />
                        </div>
                        <h3 className="font-medium text-sm mb-2">{sacco.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          {sacco.connected ? `Shares: KSH ${sacco.shares.toLocaleString()}` : 'Not connected'}
                        </p>
                        <Button 
                          size="sm" 
                          variant={sacco.connected ? "outline" : "default"}
                          className="w-full"
                        >
                          {sacco.connected ? 'Manage' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="bonds" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { name: "Treasury Bills", connected: true, amount: 150000 },
                      { name: "Treasury Bonds", connected: true, amount: 300000 },
                      { name: "Infrastructure Bonds", connected: false, amount: 0 },
                      { name: "Corporate Bonds", connected: false, amount: 0 }
                    ].map((bond, index) => (
                      <div key={index} className="p-4 border rounded-lg bg-background/50">
                        <div className="flex items-center justify-between mb-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div className={`w-2 h-2 rounded-full ${bond.connected ? 'bg-success' : 'bg-muted'}`} />
                        </div>
                        <h3 className="font-medium text-sm mb-2">{bond.name}</h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          {bond.connected ? `Value: KSH ${bond.amount.toLocaleString()}` : 'Not connected'}
                        </p>
                        <Button 
                          size="sm" 
                          variant={bond.connected ? "outline" : "default"}
                          className="w-full"
                        >
                          {bond.connected ? 'Manage' : 'Connect'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;