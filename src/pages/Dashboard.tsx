import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Link as LinkIcon, Settings, Zap, LogOut, ExternalLink, Eye, TrendingUp, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import logo from "@/assets/logo.png";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { getProfileLimit, canCreateProfile } from "@/lib/profileLimits";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { plan } = useSubscription();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalViews: number;
    totalClicks: number;
    viewsChange: number;
    clicksChange: number;
    viewsData: Array<{ date: string; views: number }>;
    clicksData: Array<{ date: string; clicks: number }>;
  }>({
    totalViews: 0,
    totalClicks: 0,
    viewsChange: 0,
    clicksChange: 0,
    viewsData: [],
    clicksData: [],
  });

  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .order('is_primary', { ascending: false })
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProfiles(data || []);

        // Load analytics for the primary profile
        if (data && data.length > 0) {
          const primaryProfile = data.find(p => p.is_primary) || data[0];
          await loadAnalytics(primaryProfile.user_id);
        }
      } catch (error) {
        console.error('Error loading profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfiles();
  }, [navigate]);

  const loadAnalytics = async (profileId: string) => {
    try {
      // Get current date and date one week ago
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

      // Get total views
      const { count: totalViews } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId);

      // Get views from last week
      const { count: lastWeekViews } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .gte('viewed_at', oneWeekAgo.toISOString());

      // Get views from previous week
      const { count: previousWeekViews } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .gte('viewed_at', twoWeeksAgo.toISOString())
        .lt('viewed_at', oneWeekAgo.toISOString());

      // Get total clicks
      const { count: totalClicks } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId);

      // Get clicks from last week
      const { count: lastWeekClicks } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .gte('clicked_at', oneWeekAgo.toISOString());

      // Get clicks from previous week
      const { count: previousWeekClicks } = await supabase
        .from('link_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profileId)
        .gte('clicked_at', twoWeeksAgo.toISOString())
        .lt('clicked_at', oneWeekAgo.toISOString());

      // Calculate percentage changes
      const viewsChange = previousWeekViews && previousWeekViews > 0
        ? Math.round(((lastWeekViews || 0) - previousWeekViews) / previousWeekViews * 100)
        : 0;
      
      const clicksChange = previousWeekClicks && previousWeekClicks > 0
        ? Math.round(((lastWeekClicks || 0) - previousWeekClicks) / previousWeekClicks * 100)
        : 0;

      // Get daily data for last 7 days
      const { data: viewsData } = await supabase
        .from('profile_views')
        .select('viewed_at')
        .eq('profile_id', profileId)
        .gte('viewed_at', oneWeekAgo.toISOString())
        .order('viewed_at', { ascending: true });

      const { data: clicksData } = await supabase
        .from('link_clicks')
        .select('clicked_at')
        .eq('profile_id', profileId)
        .gte('clicked_at', oneWeekAgo.toISOString())
        .order('clicked_at', { ascending: true });

      // Aggregate by day
      const viewsByDay = aggregateViewsByDay(viewsData || []);
      const clicksByDay = aggregateClicksByDay(clicksData || []);

      setStats({
        totalViews: totalViews || 0,
        totalClicks: totalClicks || 0,
        viewsChange,
        clicksChange,
        viewsData: viewsByDay,
        clicksData: clicksByDay,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const aggregateViewsByDay = (data: any[]): Array<{ date: string; views: number }> => {
    const dayMap: Record<string, number> = {};
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dayMap[dateStr] = 0;
    }

    data.forEach((item) => {
      const date = new Date(item.viewed_at);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dayMap.hasOwnProperty(dateStr)) {
        dayMap[dateStr]++;
      }
    });

    return Object.entries(dayMap).map(([date, views]) => ({ date, views }));
  };

  const aggregateClicksByDay = (data: any[]): Array<{ date: string; clicks: number }> => {
    const dayMap: Record<string, number> = {};
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dayMap[dateStr] = 0;
    }

    data.forEach((item) => {
      const date = new Date(item.clicked_at);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (dayMap.hasOwnProperty(dateStr)) {
        dayMap[dateStr]++;
      }
    });

    return Object.entries(dayMap).map(([date, clicks]) => ({ date, clicks }));
  };

  const handleCreateProfile = async () => {
    const profileLimit = getProfileLimit(plan);
    if (!canCreateProfile(profiles.length, plan)) {
      toast({
        title: "Profile limit reached",
        description: `Your ${plan || 'free'} plan allows up to ${profileLimit} bio page${profileLimit > 1 ? 's' : ''}. Upgrade to add more.`,
        variant: "destructive",
      });
      navigate('/upgrade');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({ user_id: user.id, name: '', is_primary: false })
        .select('*')
        .single();

      if (error) throw error;

      navigate(`/editor?id=${(data as any).id ?? (data as any).user_id}`);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDeleteProfile = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(profiles.filter(p => p.id !== profileId));
      toast({ title: "Bio page deleted successfully" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

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
        <div className="container mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <img src={logo} alt="trybio.ai" className="h-8" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/upgrade">
              <Button variant="ghost" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                Upgrade
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
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
        {/* Bio Pages Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Bio Pages</CardTitle>
                <CardDescription>
                  {profiles.length} of {getProfileLimit(plan)} page{getProfileLimit(plan) > 1 ? 's' : ''} used
                </CardDescription>
              </div>
              <Button size="sm" onClick={handleCreateProfile}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Bio
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : profiles.length > 0 ? (
              <div className="space-y-4">
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="bg-muted text-lg">
                        {profile.name ? profile.name.slice(0, 2).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg">{profile.name || "No name set"}</h3>
                        {profile.is_primary && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Primary</span>
                        )}
                      </div>
                      {profile.username && (
                        <p className="text-sm text-muted-foreground mb-2">@{profile.username}</p>
                      )}
                      <p className="text-sm">{profile.bio || "No bio set"}</p>
                      {profile.links && profile.links.length > 0 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {profile.links.length} link{profile.links.length !== 1 ? 's' : ''} added
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {profile.username && (
                        <Link to={`/${profile.username}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Link to={`/editor?id=${profile.id}`}>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      {!profile.is_primary && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteProfile(profile.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No bio pages created yet</p>
                <Button onClick={handleCreateProfile}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Bio
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats with Graphs */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={stats.totalViews.toString()}
            change={`${stats.viewsChange > 0 ? '+' : ''}${stats.viewsChange}%`}
            icon={<BarChart3 className="h-5 w-5" />}
            positive={stats.viewsChange >= 0}
            chartData={stats.viewsData}
            dataKey="views"
          />
          <StatCard
            title="Total Clicks"
            value={stats.totalClicks.toString()}
            change={`${stats.clicksChange > 0 ? '+' : ''}${stats.clicksChange}%`}
            icon={<LinkIcon className="h-5 w-5" />}
            positive={stats.clicksChange >= 0}
            chartData={stats.clicksData}
            dataKey="clicks"
          />
          <StatCard
            title="Conversion Rate"
            value={stats.totalViews > 0 ? `${Math.round((stats.totalClicks / stats.totalViews) * 100)}%` : '0%'}
            change="+0%"
            icon={<TrendingUp className="h-5 w-5" />}
            positive={true}
            chartData={stats.viewsData}
            dataKey="views"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon, positive = true, chartData, dataKey }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  positive?: boolean;
  chartData?: any[];
  dataKey?: string;
}) => (
  <div className="bg-card border border-border rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <span className="text-sm text-muted-foreground">{title}</span>
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className={`text-sm mb-4 ${positive ? 'text-green-600' : 'text-red-600'}`}>
      {change} from last week
    </div>
    {chartData && chartData.length > 0 && (
      <div className="h-16 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </div>
);

export default Dashboard;
