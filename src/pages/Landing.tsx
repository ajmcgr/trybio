import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Palette, BarChart3, Lock, Globe, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSubscription, SUBSCRIPTION_TIERS } from "@/contexts/SubscriptionContext";
import alexBioPreview from "@/assets/alex-bio-preview.png";

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
      <section className="pt-24 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-0 items-center justify-center">
            {/* Left side - Hero Content (65%) */}
            <div className="lg:w-[65%] text-center lg:text-left px-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm mb-8 animate-fade-in">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>AI-powered bio pages in 60 seconds</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-medium mb-6 leading-tight animate-slide-up">
                The fastest way to turn
                <span className="text-primary"> attention </span>
                into action
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: "0.1s" }}>
                Create a stunning link-in-bio page that converts. AI-powered setup, beautiful themes, and powerful analytics—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="gap-2 text-lg px-8 h-14">
                    Create your free bio <ArrowRight className="h-5 w-5" />
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
            
            {/* Right side - Bio Preview (30%) */}
            <div className="lg:w-[30%] w-full flex justify-center">
              <img 
                src={alexBioPreview} 
                alt="Bio page preview - Alex MacGregor's profile" 
                className="w-full h-auto"
              />
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
          <div className="grid md:grid-cols-4 gap-6">
            <ThemeCard name="Sunset" bgColor="#e74c3c" />
            <ThemeCard name="Ocean" bgColor="#3498db" />
            <ThemeCard name="Forest" bgColor="#2ecc71" />
            <ThemeCard name="Purple" bgColor="#9b59b6" />
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
                "7-day analytics"
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
                "All Themes",
                "Custom domains",
                "90-day analytics",
                "Remove Bio branding"
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
                "20 bio pages",
                "Unlimited links",
                "All Themes",
                "Custom domains",
                "12-month analytics",
                "Remove Bio branding",
                "Priority Support"
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

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-secondary/50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about trybio.ai</p>
          </div>
          <div className="space-y-4">
            <FAQItem
              question="How do I get started?"
              answer="Simply sign up for a free account, and you'll be guided through creating your first bio page. Our AI will help you set up your page in under 60 seconds by importing your social profiles and suggesting relevant links."
            />
            <FAQItem
              question="Can I use my own domain?"
              answer="Yes! Pro and Business plans allow you to connect custom domains. You'll get full SSL support and can use either a root domain (yourdomain.com) or a subdomain (bio.yourdomain.com)."
            />
            <FAQItem
              question="What analytics do I get?"
              answer="You'll get detailed insights including page views, link clicks, click-through rates, geographic data, device types, and referral sources. Free accounts get 7 days of analytics, Pro gets 90 days, and Business gets 12 months."
            />
            <FAQItem
              question="Can I create multiple bio pages?"
              answer="Yes! Free accounts get 1 bio page, Pro accounts get 5 pages, and Business accounts get 20 pages. This is perfect if you manage multiple brands or want separate pages for different purposes."
            />
            <FAQItem
              question="How does the AI setup work?"
              answer="Our AI analyzes your social profiles and automatically generates a personalized bio, suggests relevant links, and recommends themes that match your brand. You can always customize everything afterwards."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Absolutely! You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period, and you can always reactivate later."
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
                Create your free bio <ArrowRight className="h-5 w-5" />
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

const ThemeCard = ({ name, bgColor }: { name: string; bgColor: string }) => (
  <div className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-shadow">
    <div 
      className="aspect-[9/16] rounded-xl mb-4 flex items-center justify-center text-white font-semibold" 
      style={{ backgroundColor: bgColor }}
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 mx-auto mb-3"></div>
        <div className="space-y-2">
          <div className="h-2 w-20 bg-white/30 rounded mx-auto"></div>
          <div className="h-2 w-16 bg-white/30 rounded mx-auto"></div>
        </div>
      </div>
    </div>
    <h3 className="font-semibold mb-2">{name}</h3>
    <p className="text-sm text-muted-foreground">Beautiful and minimal</p>
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

const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <h3 className="font-semibold text-lg mb-3">{question}</h3>
    <p className="text-muted-foreground">{answer}</p>
  </div>
);

export default Landing;
