import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram as InstagramIcon, Users, TrendingUp, Link2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Instagram = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 text-sm mb-8">
              <InstagramIcon className="h-4 w-4 text-pink-500" />
              <span>Instagram Link in Bio</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-medium mb-6 leading-tight">
              The Best Link in Bio for <span className="text-pink-500">Instagram</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Instagram only allows one link in your bio. Make it count with trybio.ai—the smart way to share all your content, products, and services from a single, beautiful page.
            </p>
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gap-2 text-lg px-8 h-14">
                Create your Instagram bio <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="space-y-12 mb-16">
            <FeatureBlock
              icon={<Link2 className="h-6 w-6" />}
              title="Why Instagram Creators Need a Link in Bio"
              description="With only one clickable link in your Instagram bio, you need a solution that maximizes every opportunity. trybio.ai lets you share unlimited links from a single URL—whether it's your latest YouTube video, online store, blog post, or event signup."
            />
            
            <FeatureBlock
              icon={<Users className="h-6 w-6" />}
              title="Convert Your Instagram Followers"
              description="Your Instagram posts drive attention, but where does that traffic go? With trybio.ai, you can guide your followers to exactly where you want them—whether that's a product launch, newsletter signup, or your latest content. Track every click with built-in analytics to understand what resonates."
            />
            
            <FeatureBlock
              icon={<TrendingUp className="h-6 w-6" />}
              title="Optimize for Maximum Engagement"
              description="Our AI-powered platform helps you arrange links based on performance, suggest content your audience will love, and create a stunning visual experience that matches your Instagram aesthetic. Choose from beautiful themes or customize every detail to align with your brand."
            />
          </div>

          <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl p-12 border border-pink-500/20 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-medium mb-4">
              Ready to Maximize Your Instagram Bio?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of Instagram creators using trybio.ai to turn followers into customers.
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

export default Instagram;
