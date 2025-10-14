import { Button } from "@/components/ui/button";
import { CreditCard, Check } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Stripe Payment Links
const PAYMENT_LINKS = {
  pro_monthly: 'https://buy.stripe.com/fZu3cw94M5Mq6fn5SR9sk01',
  pro_yearly: 'https://buy.stripe.com/fZu3cw94M5Mq6fn5SR9sk02', // Update with actual yearly link
};

const Upgrade = () => {
  const { subscribed, productId, checkSubscription, openCustomerPortal, loading } = useSubscription();

  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

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
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-4xl">
          <Link to="/dashboard" className="flex items-center">
            <img src={logo} alt="trybio.ai" className="h-8" />
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                Back to Dashboard
              </Button>
            </Link>
            {subscribed && (
              <Button variant="outline" onClick={openCustomerPortal} disabled={loading}>
                <CreditCard className="h-4 w-4 mr-2" />
                Manage Billing
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-medium mb-4">Choose Your Plan</h1>
          <p className="text-muted-foreground text-lg">
            Upgrade to unlock advanced features and grow your presence
          </p>
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
                  1 bio page
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  10 links
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Basic themes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  7-day analytics
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
                  5 bio pages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Unlimited links
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  All Themes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Custom domains
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  90-day analytics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Remove Bio branding
                </li>
              </ul>
              {getCurrentPlan() !== 'Pro' ? (
                <Button 
                  className="w-full" 
                  asChild
                >
                  <a href={PAYMENT_LINKS.pro_monthly} target="_blank" rel="noopener noreferrer">
                    Upgrade to Pro
                  </a>
                </Button>
              ) : (
                <Button variant="outline" className="w-full" onClick={openCustomerPortal} disabled={loading}>
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
                  20 bio pages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Unlimited links
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  All Themes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Custom domains
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  12-month analytics
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Remove Bio branding
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  Priority Support
                </li>
              </ul>
              {getCurrentPlan() !== 'Business' ? (
                <Button 
                  className="w-full" 
                  asChild
                >
                  <a href={PAYMENT_LINKS.pro_yearly} target="_blank" rel="noopener noreferrer">
                    Upgrade to Business
                  </a>
                </Button>
              ) : (
                <Button variant="outline" className="w-full" onClick={openCustomerPortal} disabled={loading}>
                  Manage Subscription
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
