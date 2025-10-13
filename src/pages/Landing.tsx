import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Palette, BarChart3, Lock, Globe, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/contexts/SubscriptionContext";

const Landing = () => {
  const { user, subscribed, productId, createCheckout, openCustomerPortal } = useSubscription();

  useEffect(() => {
    // Load Senja widget script
    const script = document.createElement('script');
    script.src = 'https://widget.senja.io/widget/58e8f3b2-43d4-43fd-a3b3-201481da7ccd/platform.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-powered bio pages in 60 seconds</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-medium mb-6 leading-tight animate-slide-up">
            The fastest way to turn
            <span className="text-primary"> attention </span>
            into action
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Create a stunning link-in-bio page that converts. AI-powered setup, beautiful themes, and powerful analytics—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your page free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <div className="max-w-md">
              <div className="senja-embed" data-id="58e8f3b2-43d4-43fd-a3b3-201481da7ccd" data-mode="shadow" data-lazyload="false"></div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free forever plan
          </p>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 px-6 bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl">
            <div className="aspect-[16/9] bg-muted rounded-2xl flex items-center justify-center">
              <p className="text-muted-foreground">Live preview demo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-4">Everything you need to grow</h2>
            <p className="text-xl text-muted-foreground">Powerful features that help you convert visitors into customers</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="AI-Powered Setup"
              description="Import your socials and let AI generate your bio, suggest links, and optimize your page in seconds."
            />
            <FeatureCard
              icon={<Palette className="h-6 w-6" />}
              title="Beautiful Themes"
              description="Choose from dozens of stunning themes or create your own with our powerful customization tools."
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Advanced Analytics"
              description="Track every click, view, and conversion. Understand your audience with detailed insights."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Content Gating"
              description="Protect links with passwords, email capture, or paywalls. Monetize your content effortlessly."
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6" />}
              title="Custom Domains"
              description="Use your own domain for a professional look. Full SSL and DNS support included."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Smart Optimization"
              description="Auto-reorder links based on performance. Get AI suggestions to improve conversion rates."
            />
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section id="themes" className="py-24 px-6 bg-secondary/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-4">Themes that stand out</h2>
            <p className="text-xl text-muted-foreground">Premium designs that make you look professional instantly</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-shadow">
                <div className="aspect-[9/16] bg-muted rounded-xl mb-4"></div>
                <h3 className="font-semibold mb-2">Theme {i}</h3>
                <p className="text-sm text-muted-foreground">Beautiful and minimal</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-muted-foreground">Start free, upgrade when you're ready to grow</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              name="Free"
              price="$0"
              description="Perfect for getting started"
              features={[
                "1 bio page",
                "10 links",
                "Basic themes",
                "7-day analytics",
                "Tips enabled (5% fee)"
              ]}
              onSelect={() => {
                if (!user) {
                  window.location.href = '/auth?mode=signup';
                }
              }}
              buttonText="Get Started"
            />
            <PricingCard
              name="Pro"
              price="$19"
              description="For creators and businesses"
              features={[
                "5 bio pages",
                "Unlimited links",
                "Custom domains",
                "90-day analytics",
                "A/B testing",
                "No tips fee"
              ]}
              highlighted
              onSelect={() => {
                if (subscribed && productId === SUBSCRIPTION_TIERS.pro.productId) {
                  openCustomerPortal();
                } else {
                  createCheckout(SUBSCRIPTION_TIERS.pro.priceId);
                }
              }}
              buttonText={
                subscribed && productId === SUBSCRIPTION_TIERS.pro.productId
                  ? "Manage"
                  : "Upgrade"
              }
              isCurrentPlan={subscribed && productId === SUBSCRIPTION_TIERS.pro.productId}
            />
            <PricingCard
              name="Business"
              price="$49"
              description="For teams and agencies"
              features={[
                "25 bio pages",
                "Team access",
                "12-month analytics",
                "Priority support",
                "API access",
                "SSO"
              ]}
              onSelect={() => {
                if (subscribed && productId === SUBSCRIPTION_TIERS.business.productId) {
                  openCustomerPortal();
                } else {
                  createCheckout(SUBSCRIPTION_TIERS.business.priceId);
                }
              }}
              buttonText={
                subscribed && productId === SUBSCRIPTION_TIERS.business.productId
                  ? "Manage"
                  : "Upgrade"
              }
              isCurrentPlan={subscribed && productId === SUBSCRIPTION_TIERS.business.productId}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-6">Ready to grow your audience?</h2>
            <p className="text-xl text-muted-foreground mb-8">Join thousands of creators using trybio.ai to turn attention into action.</p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your page free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const PricingCard = ({ name, price, description, features, highlighted, onSelect, buttonText, isCurrentPlan }: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  onSelect: () => void;
  buttonText: string;
  isCurrentPlan?: boolean;
}) => (
  <div className={`bg-card border rounded-2xl p-8 relative ${
    highlighted ? 'border-primary shadow-xl scale-105' : 
    isCurrentPlan ? 'border-primary' : 'border-border'
  }`}>
    {isCurrentPlan && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
        Your Plan
      </div>
    )}
    {highlighted && !isCurrentPlan && (
      <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full mb-4">
        Most Popular
      </div>
    )}
    <h3 className="font-bold text-2xl mb-2">{name}</h3>
    <div className="mb-2">
      <span className="text-4xl font-bold">{price}</span>
      {price !== "$0" && <span className="text-muted-foreground">/month</span>}
    </div>
    <p className="text-muted-foreground mb-6">{description}</p>
    <Button 
      className="w-full mb-6" 
      variant={highlighted && !isCurrentPlan ? "default" : "outline"}
      onClick={onSelect}
    >
      {buttonText}
    </Button>
    <ul className="space-y-3">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2 text-sm">
          <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

export default Landing;
