import { Button } from "@/components/ui/button";
import { ArrowRight, Facebook as FacebookIcon, Users, TrendingUp, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Facebook = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 text-sm mb-8">
              <FacebookIcon className="h-4 w-4 text-blue-600" />
              <span>Facebook Link in Bio</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-medium mb-6 leading-tight">
              The Best Link in Bio for <span className="text-blue-600">Facebook</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Facebook pages and profiles need a central hub for all your links. With trybio.ai, create a professional landing page that connects your Facebook community to everything you offer—from your business and events to other social channels.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your Facebook bio <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-12 mb-16">
            <FeatureBlock
              icon={<Link2 className="h-6 w-6" />}
              title="Why Facebook Users Need a Link in Bio"
              description="Whether you run a Facebook Page, Group, or personal profile, you need an easy way to share multiple destinations. trybio.ai gives you one powerful link to showcase your website, online store, events, Instagram, YouTube, and more—perfect for businesses, influencers, and community leaders."
            />
            
            <FeatureBlock
              icon={<Users className="h-6 w-6" />}
              title="Drive Traffic from Facebook"
              description="Facebook posts have massive reach, but link sharing is limited in comments and posts. Your bio link is the reliable way to drive traffic. With trybio.ai, you can promote events, product launches, blog posts, and services—all trackable with detailed analytics to measure your Facebook ROI."
            />
            
            <FeatureBlock
              icon={<TrendingUp className="h-6 w-6" />}
              title="Perfect for Business Pages"
              description="If you manage a Facebook Business Page, trybio.ai becomes your marketing hub. Share your latest promotions, booking links, customer reviews, contact options, and social proof. Choose professional themes that match your brand identity and update your links anytime without touching your Facebook settings."
            />
          </div>

          <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 rounded-3xl p-12 border border-blue-600/20 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">
              Ready to Maximize Your Facebook Presence?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of businesses and creators using trybio.ai to grow their Facebook community.
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

export default Facebook;
