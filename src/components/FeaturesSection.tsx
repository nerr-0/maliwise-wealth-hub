import { Card, CardContent } from "@/components/ui/card";
import { Brain, TrendingUp, Shield, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Insights",
    description: "Get intelligent investment recommendations based on market analysis and your portfolio performance."
  },
  {
    icon: TrendingUp,
    title: "Portfolio Tracking",
    description: "Monitor your investments across chamas, saccos, REITs, stocks, and bonds in real-time."
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Advanced risk assessment tools to help you make informed investment decisions."
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Detailed analytics and reporting to track your financial growth and optimize returns."
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Key Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage and grow your investment portfolio effectively
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;