import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreditCard, ArrowRight, CheckCircle2, Globe, Lock, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useSubscription, PAYMENT_LINKS } from "@/contexts/SubscriptionContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { STRIPE_PORTAL_URL } from "@/lib/billing";

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscribed, plan, subscriptionEnd, refreshSubscription, loading } = useSubscription();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    console.log('[Settings] Current subscription state:', { subscribed, plan, subscriptionEnd });
    refreshSubscription();
  }, [refreshSubscription]);

  const getCurrentPlan = () => {
    console.log('[Settings] Getting current plan. subscribed:', subscribed, 'plan:', plan);
    if (!subscribed) return 'Free';
    return plan === 'pro' ? 'Pro' : 'Business';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsChangingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });

      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not update password.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeletingAccount(true);

      // First, delete user profile data
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').delete().eq('user_id', user.id);
      }

      // Then sign out and delete auth user
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not delete account.",
        variant: "destructive",
      });
      setIsDeletingAccount(false);
    }
  };

  const currentPlan = getCurrentPlan();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-4xl">
        <Link to="/dashboard" className="flex items-center">
          <img src={logo} alt="trybio.ai" className="h-8" />
        </Link>
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-medium mb-2">Account Settings</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing preferences
          </p>
        </div>

        {/* Current Plan Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              <Badge variant={subscribed ? "default" : "secondary"}>
                {currentPlan}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscribed ? (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Active subscription</span>
                </div>
                {subscriptionEnd && (
                  <div className="text-sm text-muted-foreground">
                    Renews on {formatDate(subscriptionEnd)}
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button asChild>
                    <a href={STRIPE_PORTAL_URL} target="_blank" rel="noopener noreferrer">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Manage Billing
                    </a>
                  </Button>
                  <Link to="/upgrade">
                    <Button variant="outline">
                      Change Plan
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground">
                  You're currently on the free plan
                </div>
                <Link to="/upgrade">
                  <Button>
                    Upgrade Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Domain Settings - Only show for Pro/Business */}
        {subscribed && (plan === 'pro' || plan === 'business') && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custom Domain</CardTitle>
                  <CardDescription>Connect your own domain to your bio page</CardDescription>
                </div>
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <Link to="/settings/domain">
                <Button variant="outline">
                  Configure Domain
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Available Plans */}
        {!subscribed && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Available Plans</h2>
            
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pro</CardTitle>
                  <div className="text-2xl font-bold">$19/mo</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    5 bio pages
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Unlimited links
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    All Themes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Custom domains
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    90-day analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Remove Bio branding
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  asChild
                >
                  <a href={PAYMENT_LINKS.pro_monthly} target="_blank" rel="noopener noreferrer">
                    Upgrade to Pro
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Business</CardTitle>
                  <div className="text-2xl font-bold">$49/mo</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    20 bio pages
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Unlimited links
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    All Themes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Custom domains
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    12-month analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Remove Bio branding
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Priority Support
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  asChild
                >
                  <a href={PAYMENT_LINKS.business_monthly} target="_blank" rel="noopener noreferrer">
                    Upgrade to Business
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Security Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Security</h2>
          
          {/* Change Password */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                <div>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Enter new password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleChangePassword}
                disabled={isChangingPassword || !newPassword || !confirmPassword}
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                <div>
                  <CardTitle className="text-destructive">Delete Account</CardTitle>
                  <CardDescription>Permanently delete your account and all data</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This action cannot be undone. This will permanently delete your account, bio page, and all associated data.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account
                      and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeletingAccount ? "Deleting..." : "Delete Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
