import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "John Doe",
    role: "Investment Manager",
    avatar: "JD",
    content: "MaliWise has transformed how I manage my clients' portfolios. The AI insights are incredibly accurate.",
    rating: 5
  },
  {
    name: "Sarah Chen",
    role: "SACCO Member",
    avatar: "SC",
    content: "Finally, a platform that understands the Kenyan investment landscape. Perfect for tracking my chama contributions.",
    rating: 5
  },
  {
    name: "Michael Ochieng",
    role: "Financial Advisor",
    avatar: "MO",
    content: "The comprehensive dashboard and analytics have made portfolio management so much easier for my clients.",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What our users say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied investors who trust MaliWise with their portfolio management
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card shadow-card hover:shadow-elegant transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;