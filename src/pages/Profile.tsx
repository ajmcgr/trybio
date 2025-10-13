import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Link as LinkIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { SUBSCRIPTION_TIERS } from "@/contexts/SubscriptionContext";

const Profile = () => {
  const [searchParams] = useSearchParams();
  const { username } = useParams();
  const isPreview = searchParams.get('preview') === 'true';
  
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    avatarUrl: "",
    font: "font-sans",
  });
  const [profileId, setProfileId] = useState<string | null>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [buttonColor, setButtonColor] = useState("#000000");
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [isPaidUser, setIsPaidUser] = useState(false);

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
          setButtonTextColor(data.buttonTextColor || '#ffffff');
          setBackgroundColor(data.backgroundColor);
        }
      } else if (username) {
        // Load from Supabase by username for public profile
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

          if (error) {
            console.error('Error loading profile:', error);
            return;
          }

          if (data) {
            setProfileId(data.user_id);
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
            setButtonTextColor(data.button_text_color || '#ffffff');
            setBackgroundColor(data.background_color || '#ffffff');

            // Check if user has a paid subscription
            try {
              const { data: subData } = await supabase.functions.invoke('check-subscription', {
                headers: {
                  Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
                },
              });

              const hasPaidPlan = subData?.subscribed && 
                (subData?.product_id === SUBSCRIPTION_TIERS.pro.productId || 
                 subData?.product_id === SUBSCRIPTION_TIERS.business.productId);
              
              setIsPaidUser(hasPaidPlan || false);
            } catch (error) {
              console.error('Error checking subscription:', error);
              setIsPaidUser(false);
            }

            // Track profile view (only for public profiles, not previews)
            await supabase
              .from('profile_views')
              .insert({
                profile_id: data.user_id,
                user_agent: navigator.userAgent,
                referrer: document.referrer
              });
          }
        } catch (error) {
          console.error('Error loading profile:', error);
        }
      }
    };

    loadProfile();
  }, [isPreview, username]);

  const handleLinkClick = async (link: any) => {
    // Track link click (only for public profiles, not previews)
    if (!isPreview && profileId) {
      try {
        await supabase
          .from('link_clicks')
          .insert({
            profile_id: profileId,
            link_title: link.title,
            link_url: link.url,
            user_agent: navigator.userAgent,
            referrer: document.referrer
          });
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex items-start justify-center md:p-6"
      style={{ backgroundColor }}
    >
      <div className="w-full md:max-w-lg">
        {/* Profile Card */}
        <div 
          className={`md:rounded-3xl p-8 shadow-2xl min-h-screen md:min-h-0 ${profile.font}`}
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
              <h1 className={`text-2xl font-bold mb-2 ${profile.font}`} style={{ color: textColor }}>
                {profile.name}
              </h1>
            )}
            {profile.username && (
              <h2 className={`text-lg font-medium mb-3 ${profile.font}`} style={{ color: textColor, opacity: 0.9 }}>
                @{profile.username}
              </h2>
            )}
            {profile.bio && (
              <p className={`text-sm ${profile.font}`} style={{ color: textColor, opacity: 0.8 }}>
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
                onClick={() => handleLinkClick(link)}
                className="block w-full py-4 px-6 rounded-2xl font-medium hover:opacity-90 transition-opacity group"
                style={{ backgroundColor: buttonColor, color: buttonTextColor }}
              >
                <div className="flex items-center justify-between">
                  <span>{link.title}</span>
                  <LinkIcon className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer - only show for free users */}
        {!isPaidUser && (
          <div className="text-center mt-6">
            <a
              href="/"
              className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              Create your own with <span className="font-semibold">trybio.ai</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
