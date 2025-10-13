import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Link as LinkIcon, Settings, CreditCard, Check } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { subscribed, productId, checkSubscription, openCustomerPortal, createCheckout, loading } = useSubscription();

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  const handleUpgrade = async (priceId: string) => {
    try {
      await createCheckout(priceId);
    } catch (error) {
      console.error('Error creating checkout:', error);
    }
  };

  const getCurrentPlan = () => {
    if (!subscribed) return 'Free';
    if (productId === 'prod_TEBcCoBIS46kPd') return 'Pro';
    if (productId === 'prod_TEBdtSpr5mGB0P') return 'Business';
    return 'Free';
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

        {/* Subscription & Billing */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Subscription & Billing</h2>
            {subscribed && (
              <Button variant="outline" onClick={openCustomerPortal} disabled={loading}>
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
            )}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Free Plan */}
            <Card className={getCurrentPlan() === 'Free' ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Free</CardTitle>
                  {getCurrentPlan() === 'Free' && <Badge>Current</Badge>}
                </div>
                <CardDescription>
                  <span className="text-3xl font-bold">$0</span>/month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Basic link-in-bio page
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Up to 5 links
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Basic analytics
                  </li>
                </ul>
                {getCurrentPlan() !== 'Free' && (
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className={getCurrentPlan() === 'Pro' ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pro</CardTitle>
                  {getCurrentPlan() === 'Pro' && <Badge>Current</Badge>}
                </div>
                <CardDescription>
                  <span className="text-3xl font-bold">$19</span>/month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Everything in Free
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Unlimited links
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Custom themes
                  </li>
                </ul>
                {getCurrentPlan() !== 'Pro' ? (
                  <Button 
                    className="w-full" 
                    onClick={() => handleUpgrade('price_1SHjFOLdEYJMHmhgROJ2Hdxz')}
                    disabled={loading}
                  >
                    Upgrade to Pro
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" onClick={openCustomerPortal}>
                    Manage Subscription
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Business Plan */}
            <Card className={getCurrentPlan() === 'Business' ? 'border-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Business</CardTitle>
                  {getCurrentPlan() === 'Business' && <Badge>Current</Badge>}
                </div>
                <CardDescription>
                  <span className="text-3xl font-bold">$49</span>/month
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    White label options
                  </li>
                </ul>
                {getCurrentPlan() !== 'Business' ? (
                  <Button 
                    className="w-full" 
                    onClick={() => handleUpgrade('price_1SHjFmLdEYJMHmhgrCPgUS2W')}
                    disabled={loading}
                  >
                    Upgrade to Business
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" onClick={openCustomerPortal}>
                    Manage Subscription
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
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
