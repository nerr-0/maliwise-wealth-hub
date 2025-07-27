import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import dashboardImage from "@/assets/dashboard-preview.jpg";
import { ArrowUpRight, Wallet, TrendingUp, PieChart } from "lucide-react";

const DashboardPreview = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Comprehensive Portfolio Dashboard
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Monitor all your investments in one place. Track performance, analyze trends, 
                and make informed decisions with our intuitive dashboard.
              </p>
            </div>
            
            <div className="grid gap-6">
              <Card className="bg-gradient-card shadow-card">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Wallet className="w-5 h-5 text-primary" />
                    <span>Total Portfolio Value</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">KSH 2,450,000</div>
                  <div className="flex items-center text-sm text-success">
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                    +12.5% this month
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gradient-card shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Active Investments</span>
                    </div>
                    <div className="text-xl font-bold">24</div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-card shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <PieChart className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Asset Classes</span>
                    </div>
                    <div className="text-xl font-bold">6</div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-6 text-lg">
              View Full Dashboard
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 blur-2xl"></div>
            <img 
              src={dashboardImage} 
              alt="Dashboard Preview" 
              className="relative z-10 w-full h-auto rounded-xl shadow-elegant"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;