import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";

const Header = () => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-primary-foreground">MaliWise</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Features
            </a>
            <a href="/dashboard" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Dashboard
            </a>
            <a href="#testimonials" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Reviews
            </a>
            <a href="/pricing" className="text-primary-foreground/90 hover:text-primary-foreground transition-colors">
              Pricing
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10">
                  More <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => window.location.href = '/about'}>
                  About Us
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/contact'}>
                  Contact
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                  Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hidden md:inline-flex text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => window.location.href = '/dashboard'}
            >
              Sign In
            </Button>
            
            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => window.location.href = '/dashboard'}>
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/pricing'}>
                  Pricing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/about'}>
                  About Us
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.location.href = '/contact'}>
                  Contact
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;