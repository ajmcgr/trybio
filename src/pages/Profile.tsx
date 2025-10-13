import { Link as LinkIcon, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
        {/* Profile Card */}
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
          {/* Avatar & Info */}
          <div className="text-center mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              JD
            </div>
            <h1 className="text-2xl font-bold mb-2">John Doe</h1>
            <p className="text-muted-foreground mb-3">
              Creator • Designer • Developer
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>San Francisco, CA</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <LinkButton
              title="My Website"
              url="https://example.com"
              icon="🌐"
            />
            <LinkButton
              title="Latest Project"
              url="https://example.com"
              icon="🚀"
            />
            <LinkButton
              title="Buy Me a Coffee"
              url="https://example.com"
              icon="☕"
            />
            <LinkButton
              title="Newsletter"
              url="https://example.com"
              icon="📧"
            />
          </div>

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-border">
            <SocialIcon icon="𝕏" />
            <SocialIcon icon="in" />
            <SocialIcon icon="▶" />
            <SocialIcon icon="📷" />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            Create your own with <span className="font-semibold">trybio.ai</span>
          </a>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const LinkButton = ({ title, url, icon }: { title: string; url: string; icon: string }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full py-4 px-6 bg-card border border-border rounded-2xl font-medium hover:bg-muted hover:scale-[1.02] hover:shadow-lg transition-all group"
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <span className="flex-1 text-left">{title}</span>
      <LinkIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
  </a>
);

const SocialIcon = ({ icon }: { icon: string }) => (
  <button className="h-10 w-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center font-bold">
    {icon}
  </button>
);

export default Profile;
