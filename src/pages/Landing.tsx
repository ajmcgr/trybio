import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Palette, BarChart3, Lock, Globe, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="trybio.ai" className="h-8" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#themes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Themes</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl text-center">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/auth">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your page free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14">
              View demo page
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required • Free forever plan
          </p>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 px-6 bg-secondary/50">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-card border border-border rounded-3xl p-8 shadow-2xl">
            <div className="aspect-[16/9] bg-muted rounded-2xl flex items-center justify-center">
              <p className="text-muted-foreground">Live preview demo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
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
        <div className="container mx-auto max-w-6xl">
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
        <div className="container mx-auto max-w-6xl">
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
            />
            <PricingCard
              name="Pro"
              price="$9"
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
            />
            <PricingCard
              name="Business"
              price="$29"
              description="For teams and agencies"
              features={[
                "25 bio pages",
                "Team access",
                "12-month analytics",
                "Priority support",
                "API access",
                "SSO"
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
            <h2 className="text-4xl md:text-5xl font-display font-medium mb-6">Ready to grow your audience?</h2>
            <p className="text-xl text-muted-foreground mb-8">Join thousands of creators using trybio.ai to turn attention into action.</p>
            <Link to="/auth">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your page free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><a href="https://blog.works.xyz/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="https://discord.gg/zH5GjPDT" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:alex@trybio.ai" className="hover:text-foreground transition-colors">Support</a></li>
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://discord.gg/jYyQHNS2" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Discord</a></li>
                <li><a href="http://x.com/trybioai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">X</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            Copyright © 2025 Works App, Inc. Built with ♥️ by <a href="https://works.xyz/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Works</a>.
          </div>
        </div>
      </footer>
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

const PricingCard = ({ name, price, description, features, highlighted }: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) => (
  <div className={`bg-card border rounded-2xl p-8 ${highlighted ? 'border-primary shadow-xl scale-105' : 'border-border'}`}>
    {highlighted && (
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
    <Button className="w-full mb-6" variant={highlighted ? "default" : "outline"}>
      Get Started
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
