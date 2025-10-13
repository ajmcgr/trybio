import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="w-full bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto max-w-4xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="trybio.ai" className="h-8" />
        </Link>
        <div className="flex items-center gap-3">
          <a href="/#pricing" className="text-sm text-foreground">Pricing</a>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="hover:bg-transparent hover:text-foreground">Login</Button>
          </Link>
          <Link to="/auth?mode=signup">
            <Button size="sm" className="gap-2 rounded-[4px]">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
