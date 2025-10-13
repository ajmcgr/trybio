import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const CaptionGenerator = () => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("");
  const [caption, setCaption] = useState("");

  const generateCaption = () => {
    const captions = [
      `${topic} vibes ✨ ${tone === "professional" ? "Elevating the game." : "Living my best life!"}`,
      `Just another day of ${topic} 🌟 ${tone === "casual" ? "Can't get enough!" : "Excellence in motion."}`,
      `${topic} done right 💫 ${tone === "fun" ? "Who else loves this?" : "Setting new standards."}`,
    ];
    const randomCaption = captions[Math.floor(Math.random() * captions.length)];
    setCaption(randomCaption);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Caption Generator</h1>
        <p className="text-muted-foreground mb-8">Generate engaging captions for your social media posts</p>
        
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="topic">Post Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., morning coffee"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Input
              id="tone"
              placeholder="e.g., casual, professional, fun"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            />
          </div>
          
          <Button onClick={generateCaption}>Generate Caption</Button>
          
          {caption && (
            <div className="p-6 bg-card border border-border rounded-lg mt-6">
              <h3 className="font-semibold mb-3">Your Generated Caption:</h3>
              <Textarea
                value={caption}
                readOnly
                className="min-h-[100px]"
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CaptionGenerator;
