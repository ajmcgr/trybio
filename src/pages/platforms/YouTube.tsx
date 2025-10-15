import { Button } from "@/components/ui/button";
import { ArrowRight, Youtube as YouTubeIcon, Users, TrendingUp, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const YouTube = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-sm mb-8">
              <YouTubeIcon className="h-4 w-4 text-red-500" />
              <span>YouTube Link in Bio</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-6 leading-tight break-words">
              The Best Link in Bio for <span className="text-red-500">YouTube</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Your YouTube channel description has limited link options. Give your viewers one powerful destination with trybio.ai—where they can access all your content, merch, sponsors, and social channels.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your YouTube bio <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-12 mb-16">
            <FeatureBlock
              icon={<Link2 className="h-6 w-6" />}
              title="Why YouTube Creators Need a Link in Bio"
              description="Whether you mention it in videos or pin it in comments, your link in bio is your central hub. With trybio.ai, you can share your latest uploads, playlists, merch store, Patreon, and social media—all from one clean, professional page that's easy to remember and share."
            />
            
            <FeatureBlock
              icon={<Users className="h-6 w-6" />}
              title="Monetize Your YouTube Audience"
              description="Turn video views into revenue. Direct subscribers to your merch, sponsorships, affiliate links, courses, or membership programs. Our analytics show you which links get the most clicks, helping you optimize for maximum earnings and engagement."
            />
            
            <FeatureBlock
              icon={<TrendingUp className="h-6 w-6" />}
              title="Grow Beyond YouTube"
              description="Build a multi-platform presence by connecting your YouTube audience to Instagram, TikTok, Twitter, Discord, and more. Create a cohesive brand experience with custom themes that match your channel's aesthetic, and use AI-powered suggestions to keep your content fresh and relevant."
            />
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl p-12 border border-red-500/20 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-medium mb-4 break-words">
              Ready to Grow Your YouTube Channel?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of YouTube creators using trybio.ai to monetize and expand their audience.
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

export default YouTube;
