import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    avatarUrl: "",
    font: "font-sans",
  });
  const [links, setLinks] = useState<any[]>([]);
  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [buttonColor, setButtonColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  useEffect(() => {
    const loadProfile = async () => {
      if (isPreview) {
        // Load from localStorage for preview
        const previewData = localStorage.getItem('previewData');
        if (previewData) {
          const data = JSON.parse(previewData);
          setProfile(data.profile);
          setLinks(data.links);
          setWallpaperUrl(data.wallpaperUrl);
          setTextColor(data.textColor);
          setButtonColor(data.buttonColor);
          setBackgroundColor(data.backgroundColor);
        }
      } else {
        // Load from Supabase for published profile
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (error) {
            console.error('Error loading profile:', error);
            return;
          }

          if (data) {
            setProfile({
              name: data.name || '',
              username: data.username || '',
              bio: data.bio || '',
              avatarUrl: data.avatar_url || '',
              font: data.font || 'font-sans',
            });
            setLinks(data.links || []);
            setWallpaperUrl(data.wallpaper_url || '');
            setTextColor(data.text_color || '#000000');
            setButtonColor(data.button_color || '#000000');
            setBackgroundColor(data.background_color || '#ffffff');
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadProfile();
  }, [isPreview]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div 
        className="flex-1 flex items-center justify-center p-6"
        style={{ backgroundColor }}
      >
        <div className="w-full max-w-lg">
          {/* Profile Card */}
          <div 
            className={`rounded-3xl p-8 shadow-2xl ${profile.font}`}
            style={{ 
              backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Avatar & Info */}
            <div className="text-center mb-8">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={profile.avatarUrl} />
                <AvatarFallback className="bg-muted text-2xl">
                  {profile.name ? profile.name.slice(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              {profile.name && (
                <h1 className="text-2xl font-bold mb-2" style={{ color: textColor }}>
                  {profile.name}
                </h1>
              )}
              {profile.username && (
                <h2 className="text-lg font-medium mb-3" style={{ color: textColor, opacity: 0.9 }}>
                  @{profile.username}
                </h2>
              )}
              {profile.bio && (
                <p className="text-sm" style={{ color: textColor, opacity: 0.8 }}>
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Links */}
            <div className="space-y-3">
              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 px-6 rounded-2xl font-medium hover:opacity-90 transition-opacity group"
                  style={{ backgroundColor: buttonColor, color: '#fff' }}
                >
                  <div className="flex items-center justify-between">
                    <span>{link.title}</span>
                    <LinkIcon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
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

export default Profile;
