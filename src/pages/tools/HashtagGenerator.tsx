import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const HashtagGenerator = () => {
  const [topic, setTopic] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);

  const generateHashtags = () => {
    // Simple hashtag generation logic
    const topics = topic.split(" ").filter(t => t.length > 0);
    const generated = topics.map(t => `#${t.toLowerCase()}`);
    setHashtags([...generated, "#trending", "#viral", "#explore"]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Hashtag Generator</h1>
        <p className="text-muted-foreground mb-8">Generate relevant hashtags for your social media posts</p>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your topic or keywords..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={generateHashtags}>Generate Hashtags</Button>
          
          {hashtags.length > 0 && (
            <div className="p-6 bg-card border border-border rounded-lg">
              <h3 className="font-semibold mb-3">Generated Hashtags:</h3>
              <p className="text-sm">{hashtags.join(" ")}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HashtagGenerator;
