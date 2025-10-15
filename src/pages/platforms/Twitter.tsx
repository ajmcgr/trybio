import { Button } from "@/components/ui/button";
import { ArrowRight, Twitter as TwitterIcon, Users, TrendingUp, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Twitter = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/10 text-sm mb-8">
              <TwitterIcon className="h-4 w-4" />
              <span>X (Twitter) Link in Bio</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-medium mb-6 leading-tight">
              The Best Link in Bio for <span className="text-slate-900 dark:text-white">X (Twitter)</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Your X profile allows one website link. Make it powerful with trybio.ai—the perfect landing page to convert your tweets into newsletter signups, product sales, and cross-platform growth.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your X bio <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-12 mb-16">
            <FeatureBlock
              icon={<Link2 className="h-6 w-6" />}
              title="Why X Users Need a Link in Bio"
              description="Your X bio link is prime real estate for thought leaders, creators, and businesses. With trybio.ai, you can share your newsletter, blog posts, products, podcast, YouTube channel, and other social profiles—all from one professional page that your audience can easily access and explore."
            />
            
            <FeatureBlock
              icon={<Users className="h-6 w-6" />}
              title="Convert Engagement Into Action"
              description="Great tweets drive conversations, but where do those engaged followers go next? Use trybio.ai to guide them to your newsletter signup, latest article, product launch, or community Discord. Track which links perform best and optimize based on real data from your X audience."
            />
            
            <FeatureBlock
              icon={<TrendingUp className="h-6 w-6" />}
              title="Build Your Personal Brand"
              description="X is the platform for builders, writers, and thought leaders. Amplify your influence with trybio.ai by connecting your audience to everything you create—from blog posts and podcasts to courses and consulting services. Choose themes that reflect your professional brand and update links instantly when you ship something new."
            />
          </div>

          <div className="bg-gradient-to-br from-slate-900/10 to-slate-700/10 rounded-3xl p-12 border border-slate-900/20 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">
              Ready to Amplify Your X Presence?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of creators and builders using trybio.ai to grow their audience and business.
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

export default Twitter;
