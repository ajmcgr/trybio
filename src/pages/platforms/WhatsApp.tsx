import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Users, TrendingUp, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const WhatsApp = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-sm mb-8">
              <MessageCircle className="h-4 w-4 text-green-500" />
              <span>WhatsApp Link in Bio</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-medium mb-6 leading-tight">
              The Best Link in Bio for <span className="text-green-500">WhatsApp</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              WhatsApp Business and personal profiles need a professional hub. With trybio.ai, create a landing page that connects your WhatsApp contacts to all your services, products, and social channels in one convenient location.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your WhatsApp bio <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-12 mb-16">
            <FeatureBlock
              icon={<Link2 className="h-6 w-6" />}
              title="Why WhatsApp Users Need a Link in Bio"
              description="WhatsApp Business profiles allow one website link in your bio. Make it count with trybio.ai—share your catalog, booking links, social media, support resources, and contact options. Perfect for small businesses, service providers, and entrepreneurs connecting with customers."
            />
            
            <FeatureBlock
              icon={<Users className="h-6 w-6" />}
              title="Perfect for WhatsApp Business"
              description="If you use WhatsApp for business, trybio.ai becomes your digital storefront. Share your product catalog, service menu, booking calendar, payment links, customer reviews, and more. Make it easy for customers to find what they need and take action—all from one mobile-friendly page."
            />
            
            <FeatureBlock
              icon={<TrendingUp className="h-6 w-6" />}
              title="Boost Customer Engagement"
              description="WhatsApp's personal nature drives high engagement. Capitalize on that trust with trybio.ai by providing a professional landing page that builds credibility. Track which links your WhatsApp contacts click most, and optimize your offerings based on real customer behavior data."
            />
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-700/10 rounded-3xl p-12 border border-green-500/20 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">
              Ready to Grow Your WhatsApp Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using trybio.ai to connect with customers on WhatsApp.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Get Started Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Setup in under 60 seconds
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureBlock = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex gap-6">
    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-xl mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </div>
);

export default WhatsApp;
