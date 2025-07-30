import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-investment.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-center lg:text-left space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
            MaliWise
            <span className="block text-3xl md:text-5xl font-semibold">
              Smart Investment Management
            </span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
            Take control of your financial future with comprehensive portfolio management 
            for chamas, saccos, REITs, stocks, MMF, bonds and bills - all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg"
              onClick={() => window.location.href = '/auth'}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 px-8 py-6 text-lg backdrop-blur-sm"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl animate-pulse-slow"></div>
          <img 
            src={heroImage} 
            alt="Investment Management" 
            className="relative z-10 w-full h-auto rounded-xl shadow-elegant animate-float"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;