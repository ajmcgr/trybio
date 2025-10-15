import { Button } from "@/components/ui/button";
import { ArrowRight, Send, Users, TrendingUp, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Telegram = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-sm mb-8">
              <Send className="h-4 w-4 text-blue-500" />
              <span>Telegram Link in Bio</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-6 leading-tight break-words">
              The Best Link in Bio for <span className="text-blue-500">Telegram</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Telegram channels and groups need a central hub for all important links. With trybio.ai, create a professional landing page that connects your Telegram community to your content, resources, and other platforms.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your Telegram bio <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-12 mb-16">
            <FeatureBlock
              icon={<Link2 className="h-6 w-6" />}
              title="Why Telegram Users Need a Link in Bio"
              description="Telegram channels and groups are powerful community tools, but organizing resources can be challenging. trybio.ai gives you one link to share in your channel description—providing access to your website, social media, resources, premium content, and community guidelines all in one organized page."
            />
            
            <FeatureBlock
              icon={<Users className="h-6 w-6" />}
              title="Perfect for Telegram Communities"
              description="Whether you run a crypto project, news channel, or educational group, trybio.ai helps organize your community resources. Share your whitepaper, roadmap, social channels, team information, and important announcements. Make it easy for new members to find everything they need about your project."
            />
            
            <FeatureBlock
              icon={<TrendingUp className="h-6 w-6" />}
              title="Grow Your Telegram Presence"
              description="Telegram is growing fast in crypto, tech, and global communities. Stand out with trybio.ai's professional landing pages. Direct members to premium content, paid channels, merchandise, or consulting services. Track engagement with analytics to understand what your community values most."
            />
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-blue-700/10 rounded-3xl p-12 border border-blue-500/20 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-medium mb-4 break-words">
              Ready to Elevate Your Telegram Channel?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of Telegram communities using trybio.ai to organize and grow their audience.
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

export default Telegram;
