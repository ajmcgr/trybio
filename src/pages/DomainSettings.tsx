import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface BioPage {
  user_id: string;
  username: string;
  name: string;
}

const DomainSettings = () => {
  const { subscribed, plan } = useSubscription();
  const { toast } = useToast();
  const [customDomain, setCustomDomain] = useState("");
  const [savedDomain, setSavedDomain] = useState("");
  const [selectedPage, setSelectedPage] = useState("");
  const [bioPages, setBioPages] = useState<BioPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canUseDomains = subscribed && (plan === 'pro' || plan === 'business');

  useEffect(() => {
    loadBioPages();
    loadDomainSettings();
  }, []);

  const loadBioPages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, name')
        .eq('user_id', user.id);

      if (error) throw error;

      setBioPages(data || []);
      if (data && data.length > 0) {
        setSelectedPage(data[0].user_id);
      }
    } catch (error) {
      console.error('Error loading bio pages:', error);
    }
  };

  const loadDomainSettings = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('custom_domain, user_id')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading domain:', error);
        return;
      }

      if (data?.custom_domain) {
        setSavedDomain(data.custom_domain);
        setCustomDomain(data.custom_domain);
        setSelectedPage(data.user_id);
      }
    } catch (error) {
      console.error('Error loading domain settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDomain = async () => {
    if (!canUseDomains) {
      toast({
        title: "Upgrade Required",
        description: "Custom domains are available on Pro and Business plans.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (!selectedPage) {
        toast({
          title: "No Bio Page Selected",
          description: "Please select a bio page to map your domain to.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          custom_domain: customDomain || null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', selectedPage);

      if (error) throw error;

      setSavedDomain(customDomain);
      
      const selectedBioPage = bioPages.find(page => page.user_id === selectedPage);
      toast({
        title: "Domain Saved",
        description: customDomain 
          ? `Domain mapped to @${selectedBioPage?.username}. Follow the instructions below to set it up.`
          : "Custom domain has been removed.",
      });
    } catch (error: any) {
      console.error('Error saving domain:', error);
      toast({
        title: "Error",
        description: error.message || "Could not save domain settings.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-4xl">
          <Link to="/dashboard" className="flex items-center">
            <img src={logo} alt="trybio.ai" className="h-8" />
          </Link>
          <Link to="/settings">
            <Button variant="ghost" size="sm">
              Back to Settings
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-medium mb-2 flex items-center gap-2">
            <Globe className="h-8 w-8" />
            Custom Domain
          </h1>
          <p className="text-muted-foreground">
            Use your own domain for your bio page
          </p>
        </div>

        {!canUseDomains && (
          <Card className="mb-6 border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <CardTitle className="text-yellow-600">Upgrade Required</CardTitle>
                  <CardDescription>
                    Custom domains are available on Pro and Business plans.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/upgrade">
                <Button>
                  Upgrade Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Domain Configuration</CardTitle>
            <CardDescription>
              Connect your custom domain to your bio page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio-page">Bio Page</Label>
              <Select 
                value={selectedPage} 
                onValueChange={setSelectedPage}
                disabled={!canUseDomains || isLoading || bioPages.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a bio page" />
                </SelectTrigger>
                <SelectContent>
                  {bioPages.map((page) => (
                    <SelectItem key={page.user_id} value={page.user_id}>
                      @{page.username} {page.name ? `(${page.name})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Your custom domain will point to this bio page
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Custom Domain</Label>
              <div className="flex gap-2">
                <Input
                  id="domain"
                  placeholder="bio.yourdomain.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  disabled={!canUseDomains || isLoading}
                />
                <Button 
                  onClick={handleSaveDomain}
                  disabled={!canUseDomains || isSaving || (customDomain === savedDomain && !!selectedPage)}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
              {savedDomain && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Current domain: {savedDomain}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {canUseDomains && (
          <Card>
            <CardHeader>
              <CardTitle>DNS Setup Instructions</CardTitle>
              <CardDescription>
                Configure your domain's DNS settings to point to TryBio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    Step 1: Add A Record
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                      <div className="text-muted-foreground">Type:</div>
                      <div className="col-span-2">A</div>
                      <div className="text-muted-foreground">Name:</div>
                      <div className="col-span-2">@ (or your subdomain)</div>
                      <div className="text-muted-foreground">Value:</div>
                      <div className="col-span-2">185.158.133.1</div>
                      <div className="text-muted-foreground">TTL:</div>
                      <div className="col-span-2">3600</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-semibold mb-2">Step 2: Wait for DNS Propagation</h3>
                  <p className="text-sm text-muted-foreground">
                    DNS changes can take up to 24-48 hours to propagate worldwide. Your domain will be accessible once propagation is complete.
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-semibold mb-2">Step 3: SSL Certificate</h3>
                  <p className="text-sm text-muted-foreground">
                    Once your domain is verified, we'll automatically provision an SSL certificate for secure HTTPS access.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  For detailed instructions and troubleshooting, visit our documentation.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://docs.lovable.dev/tips-tricks/custom-domains" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    View Documentation
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DomainSettings;
