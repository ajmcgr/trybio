import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UpgradeCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">Payment canceled</h1>
        <p className="text-lg text-muted-foreground">
          No worries — you can upgrade anytime.
        </p>
        <Button 
          onClick={() => navigate("/dashboard")}
          size="lg"
          className="w-full"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default UpgradeCancel;
