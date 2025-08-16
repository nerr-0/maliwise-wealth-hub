import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer 
} from "recharts";
import { 
  Wallet, TrendingUp, PieChart as PieChartIcon, DollarSign,
  ArrowUpRight, ArrowDownRight, Plus, Settings, Bell,
  Building2, Landmark, Users, FileText, CreditCard,
  LogOut
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePortfolioHoldings, useTransactions } from "@/hooks/usePortfolio";
import TransactionForm from "@/components/TransactionForm";
import AIInsights from "@/components/AIInsights";
import { format } from "date-fns";

const EnhancedDashboard = () => {
  const { user, signOut } = useAuth();
  const { data: holdings = [], isLoading: holdingsLoading } = usePortfolioHoldings();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  
  const [selectedPeriod, setSelectedPeriod] = useState("6M");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const controlHeader = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHeaderVisible(false);
      } else {
        setHeaderVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  // Calculate portfolio metrics from real data
  const totalPortfolioValue = holdings.reduce((sum, holding) => sum + (holding.current_value || 0), 0);
  const totalInvested = holdings.reduce((sum, holding) => sum + (holding.average_cost || 0) * holding.quantity, 0);
  const totalGain = totalPortfolioValue - totalInvested;
  const totalGainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  // Asset allocation from real data
  const assetAllocation = holdings.reduce((acc, holding) => {
    const existingAsset = acc.find(item => item.name === holding.asset_type);
    if (existingAsset) {
      existingAsset.value += holding.current_value || 0;
    } else {
      acc.push({
        name: holding.asset_type,
        value: holding.current_value || 0,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; color: string }>);

  // Mock portfolio performance data (would come from historical data in real app)
  const portfolioData = [
    { month: "Jan", value: totalPortfolioValue * 0.8, growth: 5.2 },
    { month: "Feb", value: totalPortfolioValue * 0.85, growth: 6.8 },
    { month: "Mar", value: totalPortfolioValue * 0.9, growth: -3.0 },
    { month: "Apr", value: totalPortfolioValue * 0.95, growth: 7.5 },
    { month: "May", value: totalPortfolioValue * 0.98, growth: 2.9 },
    { month: "Jun", value: totalPortfolioValue, growth: 5.2 }
  ];

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

  if (holdingsLoading || transactionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg">Loading your portfolio...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <div className={`border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40 transition-transform duration-300 ${
        headerVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">
                Welcome back, {user?.email}
              </h1>
              <p className="text-muted-foreground text-sm hidden sm:block">Manage your Kenyan investment portfolio</p>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES {totalPortfolioValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                KES {totalGain.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(1)}% total return
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Holdings</CardTitle>
              <PieChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{holdings.length}</div>
              <p className="text-xs text-muted-foreground">
                Across {assetAllocation.length} asset classes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
              <p className="text-xs text-muted-foreground">
                Total recorded transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Performance Chart */}
              <Card className="lg:col-span-2">
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
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Asset Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assetAllocation}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                        >
                          {assetAllocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="mt-4 space-y-2">
                    {assetAllocation.map((asset) => (
                      <div key={asset.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: asset.color }}
                          />
                          <span className="text-sm">{asset.name}</span>
                        </div>
                        <span className="text-sm font-medium">
                          KES {asset.value.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Holdings */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {holdings.slice(0, 5).map((holding) => {
                      const initialInvestment = (holding.average_cost || 0) * holding.quantity;
                      const currentValue = holding.current_value || 0;
                      const valueGrowth = currentValue - initialInvestment;
                      const growthPercent = initialInvestment > 0 ? (valueGrowth / initialInvestment) * 100 : 0;
                      
                      return (
                        <div key={holding.id} className="p-4 bg-muted rounded-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{holding.asset_name}</p>
                              <p className="text-sm text-muted-foreground">{holding.asset_type} • {holding.quantity} units</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">KES {currentValue.toLocaleString()}</p>
                              <p className={`text-sm ${growthPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {growthPercent >= 0 ? '+' : ''}KES {valueGrowth.toLocaleString()} ({growthPercent >= 0 ? '+' : ''}{growthPercent.toFixed(1)}%)
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Initial Investment: KES {initialInvestment.toLocaleString()}</span>
                            <span>Avg Cost: KES {(holding.average_cost || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionForm />
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 10).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{transaction.asset_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.transaction_type} • {format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${
                            transaction.transaction_type === 'buy' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.transaction_type === 'buy' ? '-' : '+'}KES {transaction.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <AIInsights />
          </TabsContent>

          <TabsContent value="platforms">
            <Card>
              <CardHeader>
                <CardTitle>Kenyan Financial Platforms</CardTitle>
                <p className="text-muted-foreground">Connect your accounts for automatic portfolio sync</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "NSE (Nairobi Securities Exchange)", type: "Stock Exchange", status: "Not Connected" },
                    { name: "ChamaSoft", type: "Chama Management", status: "Not Connected" },
                    { name: "Ndovu", type: "Digital Investment", status: "Not Connected" },
                    { name: "M-Pesa", type: "Mobile Money", status: "Not Connected" },
                    { name: "KCB Bank", type: "Banking", status: "Not Connected" },
                    { name: "Equity Bank", type: "Banking", status: "Not Connected" }
                  ].map((platform) => (
                    <Card key={platform.name}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">{platform.name}</h4>
                          <p className="text-sm text-muted-foreground">{platform.type}</p>
                          <p className="text-sm text-orange-600">{platform.status}</p>
                          <Button size="sm" variant="outline" className="w-full">
                            Connect
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedDashboard;