import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Eye, Settings, Palette, Sparkles, Link as LinkIcon } from "lucide-react";

const Editor = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">trybio.ai</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              Publish
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Left Panel - Editor */}
        <div className="flex-1 overflow-y-auto p-6 border-r border-border">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Profile Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Profile Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="yourname" />
                  <p className="text-sm text-muted-foreground mt-1">
                    trybio.ai/yourname
                  </p>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" placeholder="What you do in one line" />
                </div>
                <div>
                  <Label>Profile Picture</Label>
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <Plus className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            {/* Theme Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Theme
              </h2>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <button
                    key={i}
                    className="aspect-square rounded-xl border-2 border-border hover:border-primary transition-colors"
                    style={{ background: `hsl(${i * 45}, 70%, 60%)` }}
                  />
                ))}
              </div>
            </div>

            {/* Links Section */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Links
                </h2>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border border-border rounded-xl p-4 hover:bg-muted/50 transition-colors cursor-move">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <LinkIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Link Title {i}</p>
                        <p className="text-sm text-muted-foreground">https://example.com</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="w-96 bg-secondary/30 p-6 flex flex-col items-center">
          <div className="text-sm text-muted-foreground mb-4">Live Preview</div>
          <div className="w-full max-w-sm bg-background rounded-[3rem] border-8 border-card shadow-2xl overflow-hidden" style={{ height: '600px' }}>
            <div className="h-full overflow-y-auto p-6 space-y-4">
              <div className="text-center mb-6">
                <div className="h-20 w-20 rounded-full bg-muted mx-auto mb-3"></div>
                <h3 className="font-bold text-lg mb-1">Your Name</h3>
                <p className="text-sm text-muted-foreground">Your bio goes here</p>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <button
                    key={i}
                    className="w-full py-3 px-4 bg-card border border-border rounded-xl font-medium hover:bg-muted transition-colors"
                  >
                    Link Title {i}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
