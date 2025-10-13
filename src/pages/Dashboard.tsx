import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Link as LinkIcon, Settings, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">trybio.ai</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Link
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value="2,451"
            change="+12.5%"
            icon={<BarChart3 className="h-5 w-5" />}
          />
          <StatCard
            title="Total Clicks"
            value="1,024"
            change="+8.2%"
            icon={<LinkIcon className="h-5 w-5" />}
          />
          <StatCard
            title="Conversion Rate"
            value="41.8%"
            change="+2.4%"
            icon={<Sparkles className="h-5 w-5" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
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
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <LinkIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Link clicked</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  +1 click
                </div>
              </div>
            ))}
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
