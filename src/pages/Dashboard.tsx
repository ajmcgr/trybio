import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Link as LinkIcon, Settings, Zap, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="trybio.ai" className="h-8" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/upgrade">
              <Button variant="ghost" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            </Link>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Link to="/editor">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Link
              </Button>
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value="0"
            change="+0%"
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            title="Total Clicks"
            value="0"
            change="+0%"
            icon={<LinkIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Conversion Rate"
            value="0%"
            change="+0%"
            icon={<BarChart3 className="h-5 w-5" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-display font-medium mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/editor">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Create New Link</span>
              </Button>
            </Link>
            <Link to="/editor">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </Link>
            <Link to="/editor">
              <Button variant="outline" className="w-full h-24 flex-col gap-2">
                <Settings className="h-6 w-6" />
                <span>Edit Theme</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-display font-medium mb-6">Recent Activity</h2>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No activity yet. Create your first link to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-card border border-border rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-muted-foreground">{title}</span>
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm text-green-600">{change} from last week</div>
  </div>
);

export default Dashboard;
