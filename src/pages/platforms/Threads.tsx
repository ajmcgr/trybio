import { Button } from "@/components/ui/button";
import { ArrowRight, AtSign, Users, TrendingUp, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Threads = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/10 text-sm mb-8">
              <AtSign className="h-4 w-4" />
              <span>Threads Link in Bio</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-medium mb-6 leading-tight">
              The Best Link in Bio for <span className="text-slate-900 dark:text-white">Threads</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Threads profiles have limited link sharing. Make your bio link count with trybio.ai—the perfect hub to connect your Threads community to all your content, products, and other social platforms.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your Threads bio <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-12 mb-16">
            <FeatureBlock
              icon={<Link2 className="h-6 w-6" />}
              title="Why Threads Users Need a Link in Bio"
              description="Threads is Meta's newest social platform for real-time conversations. Your profile bio link is your chance to direct engaged followers to all your important destinations. With trybio.ai, share your Instagram, website, newsletter, products, and more from one clean, professional page."
            />
            
            <FeatureBlock
              icon={<Users className="h-6 w-6" />}
              title="Convert Threads Engagement"
              description="Threads posts spark conversations and community, but where do you send that traffic? trybio.ai makes it easy to guide your Threads followers to take meaningful action—whether that's following you on other platforms, signing up for your newsletter, or checking out your latest project."
            />
            
            <FeatureBlock
              icon={<TrendingUp className="h-6 w-6" />}
              title="Grow Across Meta's Ecosystem"
              description="Threads connects seamlessly with Instagram, making trybio.ai the perfect hub for your Meta presence. Unify your Instagram and Threads audiences by directing them to one central page where they can explore all your content, services, and social channels in a beautiful, mobile-optimized experience."
            />
          </div>

          <div className="bg-gradient-to-br from-slate-900/10 to-slate-700/10 rounded-3xl p-12 border border-slate-900/20 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">
              Ready to Maximize Your Threads Presence?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators using trybio.ai to grow their audience on Threads and beyond.
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

export default Threads;
