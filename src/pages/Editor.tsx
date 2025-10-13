import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Settings, Palette, Sparkles, Link as LinkIcon, Trash2, GripVertical, Upload, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import logo from "@/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface LinkItem {
  id: string;
  title: string;
  url: string;
}

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  font: string;
}

const Editor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    username: "",
    bio: "",
    avatarUrl: "",
    font: "font-sans",
  });
  
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [wallpaperUrl, setWallpaperUrl] = useState("");
  const [textColor, setTextColor] = useState("#000000");
  const [buttonColor, setButtonColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const fontOptions = [
    { value: "font-sans", label: "Inter (Sans Serif)" },
    { value: "font-display", label: "Reckless (Display)" },
    { value: "font-playfair", label: "Playfair Display (Elegant)" },
    { value: "font-poppins", label: "Poppins (Modern)" },
    { value: "font-montserrat", label: "Montserrat (Clean)" },
    { value: "font-raleway", label: "Raleway (Sophisticated)" },
    { value: "font-lora", label: "Lora (Classic)" },
    { value: "font-openSans", label: "Open Sans (Friendly)" },
    { value: "font-roboto", label: "Roboto (Professional)" },
    { value: "font-merriweather", label: "Merriweather (Traditional)" },
    { value: "font-bebas", label: "Bebas Neue (Bold)" },
    { value: "font-lobster", label: "Lobster (Playful)" },
    { value: "font-pacifico", label: "Pacifico (Fun)" },
    { value: "font-dancing", label: "Dancing Script (Handwritten)" },
    { value: "font-mono", label: "Monospace (Code)" },
    { value: "font-serif", label: "Serif (Classic)" },
  ];

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      setLinks([...links, { id: Date.now().toString(), ...newLink }]);
      setNewLink({ title: "", url: "" });
      setIsAddingLink(false);
    }
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWallpaperUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
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
    };

    loadProfile();
  }, []);

  // Auto-save with debouncing
  useEffect(() => {
    const saveData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            name: profile.name,
            username: profile.username,
            bio: profile.bio,
            avatar_url: profile.avatarUrl,
            font: profile.font,
            links: links,
            wallpaper_url: wallpaperUrl,
            text_color: textColor,
            button_color: buttonColor,
            background_color: backgroundColor,
            updated_at: new Date().toISOString(),
          });
      } catch (error) {
        console.error('Auto-save error:', error);
      }
    };

    const timeoutId = setTimeout(saveData, 1000);
    return () => clearTimeout(timeoutId);
  }, [profile, links, wallpaperUrl, textColor, buttonColor, backgroundColor]);

  const handlePreview = () => {
    localStorage.setItem('previewData', JSON.stringify({
      profile,
      links,
      wallpaperUrl,
      textColor,
      buttonColor,
      backgroundColor,
    }));
    window.open('/profile?preview=true', '_blank');
  };

  const handlePublish = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to publish",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: profile.name,
          username: profile.username,
          bio: profile.bio,
          avatar_url: profile.avatarUrl,
          font: profile.font,
          links: links,
          wallpaper_url: wallpaperUrl,
          text_color: textColor,
          button_color: buttonColor,
          background_color: backgroundColor,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: "Published!",
        description: "Your profile has been published successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const themeColors = [
    { bg: "hsl(0, 70%, 60%)", text: "#fff" },
    { bg: "hsl(45, 70%, 60%)", text: "#000" },
    { bg: "hsl(90, 70%, 60%)", text: "#000" },
    { bg: "hsl(135, 70%, 60%)", text: "#fff" },
    { bg: "hsl(180, 70%, 60%)", text: "#000" },
    { bg: "hsl(225, 70%, 60%)", text: "#fff" },
    { bg: "hsl(270, 70%, 60%)", text: "#fff" },
    { bg: "hsl(315, 70%, 60%)", text: "#fff" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center">
            <img src={logo} alt="trybio.ai" className="h-8" />
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handlePreview}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={handlePublish}>
              Publish
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Panel - Editor */}
        <div className="flex-1 overflow-y-auto p-6 border-r border-border">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Profile Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Your Name" 
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    placeholder="yourname" 
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    trybio.ai/{profile.username || "yourname"}
                  </p>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="What you do in one line"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="font">Font</Label>
                  <Select value={profile.font} onValueChange={(value) => setProfile({ ...profile, font: value })}>
                    <SelectTrigger id="font">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatarUrl} />
                      <AvatarFallback className="bg-muted">
                        <Plus className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <label htmlFor="avatar-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Image
                        </span>
                      </Button>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Design Elements Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Design Elements
              </h2>
              <div className="space-y-4">
                <div>
                  <Label>Wallpaper/Background Image</Label>
                  <div className="flex items-center gap-4 mt-2">
                    {wallpaperUrl && (
                      <div className="h-20 w-20 rounded-lg overflow-hidden border border-border">
                        <img src={wallpaperUrl} alt="Wallpaper" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <label htmlFor="wallpaper-upload">
                      <Button variant="outline" size="sm" asChild>
                        <span className="cursor-pointer">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          {wallpaperUrl ? "Change" : "Upload"} Wallpaper
                        </span>
                      </Button>
                      <input
                        id="wallpaper-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleWallpaperUpload}
                      />
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="textColor">Text Color</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        id="textColor"
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="h-10 w-full rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="buttonColor">Button Color</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        id="buttonColor"
                        type="color"
                        value={buttonColor}
                        onChange={(e) => setButtonColor(e.target.value)}
                        className="h-10 w-full rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        id="backgroundColor"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="h-10 w-full rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme Presets
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {themeColors.map((theme, i) => (
                  <button
                    key={i}
                    className={`aspect-square rounded-xl border-2 transition-colors ${
                      selectedTheme === i ? "border-primary" : "border-border hover:border-primary/50"
                    }`}
                    style={{ background: theme.bg }}
                    onClick={() => setSelectedTheme(i)}
                  />
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Links
                </h2>
                <Dialog open={isAddingLink} onOpenChange={setIsAddingLink}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Link</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="link-title">Title</Label>
                        <Input
                          id="link-title"
                          placeholder="My Website"
                          value={newLink.title}
                          onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="link-url">URL</Label>
                        <Input
                          id="link-url"
                          placeholder="https://example.com"
                          value={newLink.url}
                          onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                        />
                      </div>
                      <Button onClick={handleAddLink} className="w-full">
                        Add Link
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-3">
                {links.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No links yet. Click "Add Link" to get started!
                  </div>
                ) : (
                  links.map((link) => (
                    <div key={link.id} className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <LinkIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{link.title}</p>
                          <p className="text-sm text-muted-foreground">{link.url}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-96 bg-secondary/30 p-6 flex flex-col items-center">
          <div className="text-sm text-muted-foreground mb-4">Live Preview</div>
          <div 
            className="w-full max-w-sm rounded-[3rem] border-8 border-card shadow-2xl overflow-hidden" 
            style={{ height: '600px', backgroundColor: backgroundColor }}
          >
            <div 
              className={`h-full overflow-y-auto p-6 space-y-4 ${profile.font}`}
              style={{ 
                backgroundImage: wallpaperUrl ? `url(${wallpaperUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="text-center mb-6">
                <Avatar className="h-20 w-20 mx-auto mb-3">
                  <AvatarImage src={profile.avatarUrl} />
                  <AvatarFallback className="bg-muted">
                    {profile.name ? profile.name.slice(0, 2).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                {profile.name && (
                  <h2 className="font-bold text-xl mb-1" style={{ color: textColor }}>
                    {profile.name}
                  </h2>
                )}
                {profile.username && (
                  <h3 className="font-medium text-base mb-2" style={{ color: textColor, opacity: 0.9 }}>
                    @{profile.username}
                  </h3>
                )}
                <p className={`text-sm ${profile.font}`} style={{ color: textColor, opacity: 0.8 }}>
                  {profile.bio || "Your bio goes here"}
                </p>
              </div>
              <div className="space-y-3">
                {links.map((link) => (
                  <button
                    key={link.id}
                    className="w-full py-3 px-4 rounded-xl font-medium transition-colors"
                    style={{ 
                      backgroundColor: buttonColor,
                      color: '#fff'
                    }}
                  >
                    {link.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
