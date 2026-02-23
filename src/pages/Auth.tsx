import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { TrendingUp, Shield, PieChart, Wallet, ArrowRight } from 'lucide-react';
import { z } from 'zod';

// Validation schemas
const signInSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email is too long'),
  password: z.string().min(1, 'Password is required').max(100, 'Password is too long'),
});

const signUpSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email is too long'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100, 'Full name is too long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  confirmPassword?: string;
}

const Auth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [signInErrors, setSignInErrors] = useState<FormErrors>({});
  const [signUpErrors, setSignUpErrors] = useState<FormErrors>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          navigate('/dashboard');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpErrors({});
    
    // Validate form data
    const result = signUpSchema.safeParse(signUpData);
    
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setSignUpErrors(fieldErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: result.data.fullName
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Please check your email to confirm your account",
      });
    } catch (error: any) {
      const message = error?.message?.toLowerCase?.() || '';
      const userMessage = message.includes('invalid login')
        ? 'Invalid email or password'
        : message.includes('already registered')
        ? 'This email is already registered. Please sign in instead.'
        : 'Something went wrong. Please try again.';
      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInErrors({});
    
    // Validate form data
    const result = signInSchema.safeParse(signInData);
    
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });
      setSignInErrors(fieldErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors below",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: result.data.email,
        password: result.data.password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully signed in",
      });
    } catch (error: any) {
      const message = error?.message?.toLowerCase?.() || '';
      const userMessage = message.includes('invalid login')
        ? 'Invalid email or password'
        : 'Unable to sign in. Please check your credentials and try again.';
      toast({
        title: "Error",
        description: userMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return null;
  }

  const features = [
    { icon: TrendingUp, title: "Smart Investments", desc: "AI-powered portfolio insights" },
    { icon: Shield, title: "Secure & Safe", desc: "Bank-grade encryption" },
    { icon: PieChart, title: "Track Growth", desc: "Real-time performance analytics" },
    { icon: Wallet, title: "Multi-Platform", desc: "All your assets in one place" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/90 to-primary/70 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full animate-[pulse_4s_ease-in-out_infinite]" />
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-white/5 rounded-full animate-[pulse_6s_ease-in-out_infinite_1s]" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-[float_6s_ease-in-out_infinite_2s]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">MaliWise</h1>
            <p className="text-xl text-white/80 mb-8">Your Kenyan Wealth Management Hub</p>
          </div>

          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 150}ms` }}
              >
                <div className="p-3 bg-white/20 rounded-lg">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-white/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <p className="text-lg italic text-white/90">
              "MaliWise transformed how I manage my investments. I now have complete visibility across all my portfolios."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center font-bold">
                JM
              </div>
              <div>
                <p className="font-medium">James Mwangi</p>
                <p className="text-sm text-white/60">Investor, Nairobi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 p-4">
        <div className="w-full max-w-md animate-scale-in">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">MaliWise</h1>
            <p className="text-muted-foreground">Your Kenyan Wealth Management Hub</p>
          </div>

          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
              <CardDescription>
                Sign in to manage your investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="animate-fade-in">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                        className={`h-12 ${signInErrors.email ? 'border-destructive' : ''}`}
                        required
                      />
                      {signInErrors.email && (
                        <p className="text-sm text-destructive">{signInErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                        className={`h-12 ${signInErrors.password ? 'border-destructive' : ''}`}
                        required
                      />
                      {signInErrors.password && (
                        <p className="text-sm text-destructive">{signInErrors.password}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full h-12 text-base group" disabled={loading}>
                      {loading ? "Signing In..." : (
                        <>
                          Sign In
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="animate-fade-in">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, fullName: e.target.value }))}
                        className={`h-12 ${signUpErrors.fullName ? 'border-destructive' : ''}`}
                        required
                      />
                      {signUpErrors.fullName && (
                        <p className="text-sm text-destructive">{signUpErrors.fullName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                        className={`h-12 ${signUpErrors.email ? 'border-destructive' : ''}`}
                        required
                      />
                      {signUpErrors.email && (
                        <p className="text-sm text-destructive">{signUpErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                        className={`h-12 ${signUpErrors.password ? 'border-destructive' : ''}`}
                        required
                      />
                      {signUpErrors.password && (
                        <p className="text-sm text-destructive">{signUpErrors.password}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        Must be 8+ characters with uppercase, lowercase, and number
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm Password</Label>
                      <Input
                        id="signup-confirm"
                        type="password"
                        placeholder="Confirm your password"
                        value={signUpData.confirmPassword}
                        onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`h-12 ${signUpErrors.confirmPassword ? 'border-destructive' : ''}`}
                        required
                      />
                      {signUpErrors.confirmPassword && (
                        <p className="text-sm text-destructive">{signUpErrors.confirmPassword}</p>
                      )}
                    </div>
                    <Button type="submit" className="w-full h-12 text-base group" disabled={loading}>
                      {loading ? "Creating Account..." : (
                        <>
                          Create Account
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;