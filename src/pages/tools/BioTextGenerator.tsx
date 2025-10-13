import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const BioTextGenerator = () => {
  const [name, setName] = useState("");
  const [profession, setProfession] = useState("");
  const [interests, setInterests] = useState("");
  const [bio, setBio] = useState("");

  const generateBio = () => {
    const generatedBio = `${name} | ${profession}\n${interests}\n✨ Creating magic every day`;
    setBio(generatedBio);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">Bio Text Generator</h1>
        <p className="text-muted-foreground mb-8">Create an engaging bio for your social media profiles</p>
        
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="e.g., Alex Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="profession">Profession/Title</Label>
            <Input
              id="profession"
              placeholder="e.g., Content Creator"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interests">Interests/Focus</Label>
            <Input
              id="interests"
              placeholder="e.g., Fashion & Travel"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>
          
          <Button onClick={generateBio}>Generate Bio</Button>
          
          {bio && (
            <div className="p-6 bg-card border border-border rounded-lg mt-6">
              <h3 className="font-semibold mb-3">Your Generated Bio:</h3>
              <Textarea
                value={bio}
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

export default BioTextGenerator;
