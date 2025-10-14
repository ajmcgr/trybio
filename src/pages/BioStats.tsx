import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Link as LinkIcon, TrendingUp, ArrowLeft } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const BioStats = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const profileId = searchParams.get('id');
  
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<{
    totalViews: number;
    totalClicks: number;
    viewsChange: number;
    clicksChange: number;
    viewsData: Array<{ date: string; views: number }>;
    clicksData: Array<{ date: string; clicks: number }>;
    topLinks: Array<{ title: string; clicks: number; url: string }>;
  }>({
    totalViews: 0,
    totalClicks: 0,
    viewsChange: 0,
    clicksChange: 0,
    viewsData: [],
    clicksData: [],
    topLinks: [],
  });

  useEffect(() => {
    const loadData = async () => {
      if (!profileId) {
        navigate('/dashboard');
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles_api')
          .select('*')
          .eq('id', profileId)
          .maybeSingle();

        if (profileError) throw profileError;
        
        if (!profileData || profileData.user_id !== user.id) {
          toast({
            title: "Access denied",
            description: "You don't have permission to view these stats",
            variant: "destructive",
          });
          navigate('/dashboard');
          return;
        }

        setProfile(profileData);
        await loadAnalytics(profileId);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Error",
          description: "Failed to load stats",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [profileId, navigate]);

  const loadAnalytics = async (profileId: string) => {
    try {
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
        .select('clicked_at, link_title')
        .eq('profile_id', profileId)
        .gte('clicked_at', oneWeekAgo.toISOString())
        .order('clicked_at', { ascending: true });

      // Get top links
      const { data: allClicks } = await supabase
        .from('link_clicks')
        .select('link_title, link_url')
        .eq('profile_id', profileId);

      const linkClickMap: Record<string, { title: string; url: string; clicks: number }> = {};
      (allClicks || []).forEach((click) => {
        const key = click.link_title;
        if (!linkClickMap[key]) {
          linkClickMap[key] = { title: click.link_title, url: click.link_url, clicks: 0 };
        }
        linkClickMap[key].clicks++;
      });

      const topLinks = Object.values(linkClickMap)
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 5);

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
        topLinks,
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <img src={logo} alt="trybio.ai" className="h-8" />
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Profile Header */}
        {profile && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{profile.full_name || 'Bio Page'} Stats</h1>
            {profile.username && (
              <p className="text-muted-foreground">@{profile.username}</p>
            )}
          </div>
        )}

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

        {/* Top Links */}
        {stats.topLinks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Links</CardTitle>
              <CardDescription>Most clicked links on your bio page</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topLinks.map((link, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{link.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{link.clicks}</p>
                      <p className="text-sm text-muted-foreground">clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
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

export default BioStats;
