import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useSubscription, PAYMENT_LINKS } from "@/contexts/SubscriptionContext";

const Settings = () => {
  const { subscribed, plan, subscriptionEnd, refreshSubscription, openCustomerPortal, loading } = useSubscription();

  useEffect(() => {
    console.log('[Settings] Current subscription state:', { subscribed, plan, subscriptionEnd });
    refreshSubscription();
  }, [refreshSubscription]);

  const getCurrentPlan = () => {
    console.log('[Settings] Getting current plan. subscribed:', subscribed, 'plan:', plan);
    if (!subscribed) return 'Free';
    return plan === 'pro' ? 'Pro' : 'Business';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-4xl">
        <Link to="/dashboard" className="flex items-center">
          <img src={logo} alt="trybio.ai" className="h-8" />
        </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-medium mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing preferences
          </p>
        </div>

        {/* Current Plan Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              <Badge variant={subscribed ? "default" : "secondary"}>
                {currentPlan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscribed ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Active subscription</span>
                </div>
                {subscriptionEnd && (
                  <div className="text-sm text-muted-foreground">
                    Renews on {formatDate(subscriptionEnd)}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button onClick={openCustomerPortal} disabled={loading}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Manage Billing
                  </Button>
                  <Link to="/upgrade">
                    <Button variant="outline">
                      Change Plan
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  You're currently on the free plan
                </div>
                <Link to="/upgrade">
                  <Button>
                    Upgrade Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Available Plans */}
        {!subscribed && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Available Plans</h2>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pro</CardTitle>
                  <div className="text-2xl font-bold">$19/mo</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    5 bio pages
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Unlimited links
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    All Themes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Custom domains
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    90-day analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Remove Bio branding
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  asChild
                >
                  <a href={PAYMENT_LINKS.pro_monthly} target="_blank" rel="noopener noreferrer">
                    Upgrade to Pro
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Business</CardTitle>
                  <div className="text-2xl font-bold">$49/mo</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    20 bio pages
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Unlimited links
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    All Themes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Custom domains
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    12-month analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Remove Bio branding
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Priority Support
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  asChild
                >
                  <a href={PAYMENT_LINKS.business_monthly} target="_blank" rel="noopener noreferrer">
                    Upgrade to Business
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
