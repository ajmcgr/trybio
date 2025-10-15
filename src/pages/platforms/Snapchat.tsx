import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Users, TrendingUp, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Snapchat = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 text-sm mb-8">
              <Camera className="h-4 w-4 text-yellow-400" />
              <span>Snapchat Link in Bio</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-6 leading-tight break-words">
              The Best Link in Bio for <span className="text-yellow-400">Snapchat</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Snapchat profiles have limited link sharing options. Give your Snapchat audience a destination with trybio.ai—where they can find all your content, socials, and products in one mobile-optimized page designed for quick engagement.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your Snapchat bio <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-12 mb-16">
            <FeatureBlock
              icon={<Link2 className="h-6 w-6" />}
              title="Why Snapchat Creators Need a Link in Bio"
              description="Snapchat's ephemeral content drives curiosity and engagement. When followers want to learn more about you, they check your profile. trybio.ai ensures they find everything they need—your Instagram, TikTok, YouTube, merch store, and latest content—all in one tap."
            />
            
            <FeatureBlock
              icon={<Users className="h-6 w-6" />}
              title="Connect with Your Snap Audience"
              description="Snapchat users are highly engaged but spend time in short bursts. Make it easy for them to take action with trybio.ai's fast-loading, mobile-first design. Share your exclusive content, product drops, or other social profiles with a page that loads instantly and looks stunning on any device."
            />
            
            <FeatureBlock
              icon={<TrendingUp className="h-6 w-6" />}
              title="Perfect for Snapchat Creators"
              description="Whether you're a Snapchat influencer, brand, or content creator, trybio.ai helps you monetize your audience. Direct snaps to your latest drops, collaborations, or sponsored content. Track engagement with analytics that show exactly which links your Snapchat followers click most."
            />
          </div>

          <div className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 rounded-3xl p-12 border border-yellow-400/20 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-medium mb-4 break-words">
              Ready to Grow Beyond Snapchat?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of Snapchat creators using trybio.ai to build their multi-platform presence.
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

export default Snapchat;
