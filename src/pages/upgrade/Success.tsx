import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useEffect, useState } from "react";

const UpgradeSuccess = () => {
  const navigate = useNavigate();
  const { refreshSubscription } = useSubscription();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAndRedirect = async () => {
      await refreshSubscription();
      setChecking(false);
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    };
    
    verifyAndRedirect();
  }, [refreshSubscription, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">You're now Pro 🎉</h1>
        <p className="text-lg text-muted-foreground">
          {checking ? "Activating your subscription..." : "Your upgrade was successful. Enjoy unlimited access!"}
        </p>
        <Button 
          onClick={() => navigate("/dashboard")}
          size="lg"
          className="w-full"
          disabled={checking}
        >
          {checking ? "Please wait..." : "Go to Dashboard"}
        </Button>
      </div>
    </div>
  );
};

export default UpgradeSuccess;
