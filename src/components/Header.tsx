import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({ title: "Logged out successfully" });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <header className="w-full bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto max-w-5xl px-6 h-16 flex items-center justify-between">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center">
          <img src={logo} alt="trybio.ai" className="h-8" />
        </Link>
        <div className="flex items-center gap-3">
          <a href="/#pricing" className="text-sm text-foreground">Pricing</a>
          {user ? (
            <>
              <Link to="/upgrade">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Upgrade
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="hover:bg-transparent hover:text-foreground">Login</Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button size="sm" className="gap-2 rounded-[6px]">
                  Create your free bio <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
