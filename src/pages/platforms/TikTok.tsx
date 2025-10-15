import { Button } from "@/components/ui/button";
import { ArrowRight, Music, Users, TrendingUp, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TikTok = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/10 text-sm mb-8">
              <Music className="h-4 w-4" />
              <span>TikTok Link in Bio</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium mb-6 leading-tight break-words">
              The Best Link in Bio for <span className="bg-gradient-to-r from-cyan-500 to-pink-500 bg-clip-text text-transparent">TikTok</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Your TikTok profile has space for just one link. Make every viral video count with trybio.ai—the fastest way to convert TikTok views into followers, customers, and fans across all platforms.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your TikTok bio <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-12 mb-16">
            <FeatureBlock
              icon={<Link2 className="h-6 w-6" />}
              title="Why TikTok Creators Need a Link in Bio"
              description="TikTok content goes viral fast, but with only one bio link, you need a smart hub. trybio.ai lets you share your Instagram, YouTube, merch store, latest products, and trending content—all in one mobile-optimized page that loads instantly and looks stunning."
            />
            
            <FeatureBlock
              icon={<Users className="h-6 w-6" />}
              title="Capitalize on Viral Moments"
              description="When your TikTok goes viral, traffic floods in. Be ready with trybio.ai to capture that momentum. Instantly update your bio link to promote your newest video, product drop, or collaboration. Our real-time analytics show exactly how many clicks came from your viral content."
            />
            
            <FeatureBlock
              icon={<TrendingUp className="h-6 w-6" />}
              title="Build Your Creator Empire"
              description="TikTok is just the beginning. Use trybio.ai to funnel your TikTok audience to YouTube channels, Instagram profiles, email lists, Discord servers, and monetization platforms. Create a seamless brand experience with themes designed for Gen Z aesthetics and mobile-first engagement."
            />
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-pink-500/10 rounded-3xl p-12 border border-cyan-500/20 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-medium mb-4 break-words">
              Ready to Turn TikTok Fame into Fortune?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of TikTok creators using trybio.ai to monetize their content and grow their brand.
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

export default TikTok;
