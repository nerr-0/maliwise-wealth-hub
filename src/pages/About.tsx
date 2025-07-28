import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">About MaliWise</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-6">
                MaliWise is Kenya's premier investment management platform, designed to democratize access to wealth-building opportunities across the country.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-card p-6 rounded-lg shadow-card">
                  <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To empower every Kenyan with the tools and knowledge needed to build sustainable wealth through smart investment strategies and comprehensive portfolio management.
                  </p>
                </div>
                
                <div className="bg-card p-6 rounded-lg shadow-card">
                  <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground">
                    A financially literate Kenya where every individual has access to diverse investment opportunities and the confidence to make informed financial decisions.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-6">Why Choose MaliWise?</h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🇰🇪</span>
                  </div>
                  <h4 className="font-semibold mb-2">Kenya-First</h4>
                  <p className="text-sm text-muted-foreground">Built specifically for the Kenyan market with local investment options</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="font-semibold mb-2">Comprehensive</h4>
                  <p className="text-sm text-muted-foreground">Stocks, bonds, REITs, Chamas, SACCOs - all in one platform</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h4 className="font-semibold mb-2">Secure</h4>
                  <p className="text-sm text-muted-foreground">Bank-level security for your investments and personal data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;