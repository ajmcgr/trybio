import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UpgradeSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-4xl font-bold">You're now Pro 🎉</h1>
        <p className="text-lg text-muted-foreground">
          Your upgrade was successful. Enjoy unlimited access!
        </p>
        <Button 
          onClick={() => navigate("/dashboard")}
          size="lg"
          className="w-full"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default UpgradeSuccess;
