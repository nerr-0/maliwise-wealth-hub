import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for beginners getting started with investing",
      features: [
        "Portfolio tracking up to KSH 500K",
        "Basic analytics and insights",
        "Connect up to 2 investment accounts",
        "Monthly investment reports",
        "Educational resources access"
      ]
    },
    {
      name: "Pro",
      price: "KSH 2,500/month",
      description: "Advanced features for serious investors",
      features: [
        "Unlimited portfolio tracking",
        "Advanced analytics and AI insights",
        "Connect unlimited investment accounts",
        "Real-time market data",
        "Priority customer support",
        "Tax optimization suggestions",
        "Custom investment alerts"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for investment groups and institutions",
      features: [
        "All Pro features included",
        "White-label solutions",
        "API access and integrations",
        "Dedicated account manager",
        "Custom reporting and analytics",
        "Multi-user management",
        "Advanced security features"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your investment journey with the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary mb-2">{plan.price}</div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <Check className="w-4 h-4 text-success mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Need help choosing? Our team is here to help you find the perfect plan.
            </p>
            <Button variant="outline">Contact Support</Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;