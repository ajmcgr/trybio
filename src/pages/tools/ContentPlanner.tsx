import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const ContentPlanner = () => {
  const [posts, setPosts] = useState<Array<{ date: string; content: string }>>([]);
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");

  const addPost = () => {
    if (date && content) {
      setPosts([...posts, { date, content }]);
      setDate("");
      setContent("");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Content Planner</h1>
        <p className="text-muted-foreground mb-8">Plan and organize your social media content calendar</p>
        
        <div className="space-y-4">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Select date"
          />
          <Textarea
            placeholder="Enter post content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={addPost}>Add to Calendar</Button>
          
          {posts.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold">Your Content Calendar:</h3>
              {posts.map((post, idx) => (
                <div key={idx} className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">{post.date}</p>
                  <p className="text-sm">{post.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContentPlanner;
