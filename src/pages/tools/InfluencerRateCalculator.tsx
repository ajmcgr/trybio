import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const InfluencerRateCalculator = () => {
  const [followers, setFollowers] = useState("");
  const [engagement, setEngagement] = useState("");
  const [rate, setRate] = useState<number | null>(null);

  const calculateRate = () => {
    const followerCount = parseInt(followers);
    const engagementRate = parseFloat(engagement);
    
    if (followerCount && engagementRate) {
      // Simple rate calculation: (followers * engagement rate * $0.01)
      const calculatedRate = Math.round(followerCount * (engagementRate / 100) * 0.01);
      setRate(calculatedRate);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Influencer Rate Calculator</h1>
        <p className="text-muted-foreground mb-8">Calculate your recommended rate for sponsored content</p>
        
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="followers">Follower Count</Label>
            <Input
              id="followers"
              type="number"
              placeholder="e.g., 10000"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="engagement">Engagement Rate (%)</Label>
            <Input
              id="engagement"
              type="number"
              step="0.1"
              placeholder="e.g., 3.5"
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
            />
          </div>
          
          <Button onClick={calculateRate}>Calculate Rate</Button>
          
          {rate !== null && (
            <div className="p-6 bg-card border border-border rounded-lg mt-6">
              <h3 className="font-semibold mb-2">Recommended Rate:</h3>
              <p className="text-3xl font-bold">${rate}</p>
              <p className="text-sm text-muted-foreground mt-2">per sponsored post</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InfluencerRateCalculator;
