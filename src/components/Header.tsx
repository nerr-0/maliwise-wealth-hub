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
    <header className="absolute top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-bold text-foreground">MaliWise</span>
          </div>
          
            <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#testimonials" className="text-foreground/80 hover:text-foreground transition-colors">
              Reviews
            </a>
            <a href="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </a>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/80 hover:text-foreground hover:bg-accent/20">
                  More <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-w-[90vw] p-2">
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/about'}
                  className="cursor-pointer text-base py-3 px-4 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
                >
                  About Us
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/contact'}
                  className="cursor-pointer text-base py-3 px-4 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
                >
                  Contact
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/dashboard'}
                  className="cursor-pointer text-base py-3 px-4 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
                >
                  Dashboard
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="hidden md:inline-flex text-foreground/80 hover:text-foreground hover:bg-accent/20"
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
                  className="md:hidden text-foreground/80 hover:text-foreground hover:bg-accent/20"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-w-[90vw] p-2">
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/dashboard'}
                  className="cursor-pointer text-base py-3 px-4 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/pricing'}
                  className="cursor-pointer text-base py-3 px-4 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
                >
                  Pricing
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/about'}
                  className="cursor-pointer text-base py-3 px-4 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
                >
                  About Us
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/contact'}
                  className="cursor-pointer text-base py-3 px-4 rounded-md hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground transition-colors"
                >
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