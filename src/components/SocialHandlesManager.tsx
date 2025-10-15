import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { SocialIcon } from './SocialIcon';
import { GripVertical, Trash2, Plus } from 'lucide-react';

interface SocialHandle {
  id: string;
  platform: string;
  handle: string;
  url: string;
  is_visible: boolean;
  position: number;
}

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram', placeholder: '@username or URL' },
  { value: 'youtube', label: 'YouTube', placeholder: '@channel or URL' },
  { value: 'tiktok', label: 'TikTok', placeholder: '@username or URL' },
  { value: 'x', label: 'X (Twitter)', placeholder: '@username or URL' },
  { value: 'whatsapp', label: 'WhatsApp', placeholder: 'Phone number or URL' },
  { value: 'telegram', label: 'Telegram', placeholder: '@username or URL' },
  { value: 'threads', label: 'Threads', placeholder: '@username or URL' },
  { value: 'facebook', label: 'Facebook', placeholder: 'Username or URL' },
  { value: 'snapchat', label: 'Snapchat', placeholder: '@username or URL' },
  { value: 'email', label: 'Email', placeholder: 'your@email.com' },
];

const normalizeUrl = (platform: string, input: string): { handle: string; url: string } => {
  const trimmed = input.trim();
  
  // Email special case
  if (platform === 'email') {
    const handle = trimmed.replace('mailto:', '');
    return { handle, url: `mailto:${handle}` };
  }
  
  // If already a full URL, extract handle and return
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const handle = trimmed.split('/').pop() || trimmed;
    return { handle, url: trimmed };
  }
  
  // Remove @ if present
  const cleanHandle = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  
  // Build URL based on platform
  const urlMap: Record<string, string> = {
    instagram: `https://instagram.com/${cleanHandle}`,
    youtube: `https://youtube.com/@${cleanHandle}`,
    tiktok: `https://tiktok.com/@${cleanHandle}`,
    x: `https://x.com/${cleanHandle}`,
    whatsapp: `https://wa.me/${cleanHandle}`,
    telegram: `https://t.me/${cleanHandle}`,
    threads: `https://threads.net/@${cleanHandle}`,
    facebook: `https://facebook.com/${cleanHandle}`,
    snapchat: `https://snapchat.com/add/${cleanHandle}`,
  };
  
  return {
    handle: cleanHandle,
    url: urlMap[platform] || trimmed,
  };
};

interface SocialHandlesManagerProps {
  profileId: string;
  onChange?: () => void;
}

export const SocialHandlesManager: React.FC<SocialHandlesManagerProps> = ({ profileId, onChange }) => {
  const [handles, setHandles] = useState<SocialHandle[]>([]);
  const [newPlatform, setNewPlatform] = useState('');
  const [newInput, setNewInput] = useState('');
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchHandles();
  }, [profileId]);

  const fetchHandles = async () => {
    const { data, error } = await supabase
      .from('social_handles')
      .select('*')
      .eq('profile_id', profileId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching social handles:', error);
      return;
    }

    setHandles(data || []);
  };

  const addHandle = async () => {
    if (!newPlatform || !newInput) {
      toast({
        title: 'Missing information',
        description: 'Please select a platform and enter your handle',
        variant: 'destructive',
      });
      return;
    }

    const { handle, url } = normalizeUrl(newPlatform, newInput);
    const maxPosition = handles.length > 0 ? Math.max(...handles.map(h => h.position)) : -1;

    const { error } = await supabase
      .from('social_handles')
      .insert({
        profile_id: profileId,
        platform: newPlatform,
        handle,
        url,
        is_visible: true,
        position: maxPosition + 1,
      });

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: 'Social handle added',
    });

    setNewPlatform('');
    setNewInput('');
    fetchHandles();
    onChange?.();
  };

  const deleteHandle = async (id: string) => {
    const { error } = await supabase
      .from('social_handles')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Deleted',
      description: 'Social handle removed',
    });

    fetchHandles();
    onChange?.();
  };

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    const { error } = await supabase
      .from('social_handles')
      .update({ is_visible: !currentVisibility })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    fetchHandles();
    onChange?.();
  };

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newHandles = [...handles];
    const draggedHandle = newHandles[draggedItem];
    newHandles.splice(draggedItem, 1);
    newHandles.splice(index, 0, draggedHandle);

    setHandles(newHandles);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    if (draggedItem === null) return;

    // Update positions in database
    const updates = handles.map((handle, index) => ({
      id: handle.id,
      position: index,
    }));

    for (const update of updates) {
      await supabase
        .from('social_handles')
        .update({ position: update.position })
        .eq('id', update.id);
    }

    setDraggedItem(null);
    onChange?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new handle */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Platform</Label>
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map(p => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Handle or URL</Label>
              <Input
                value={newInput}
                onChange={(e) => setNewInput(e.target.value)}
                placeholder={PLATFORMS.find(p => p.value === newPlatform)?.placeholder || 'Enter handle or URL'}
              />
            </div>
          </div>
          <Button onClick={addHandle} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Button>
        </div>

        {/* List of handles */}
        <div className="space-y-2">
          {handles.map((handle, index) => (
            <div
              key={handle.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-move"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
              <SocialIcon platform={handle.platform} size={24} />
              <div className="flex-1">
                <div className="font-medium text-sm">
                  {PLATFORMS.find(p => p.value === handle.platform)?.label}
                </div>
                <div className="text-xs text-muted-foreground">{handle.handle}</div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={handle.is_visible}
                  onCheckedChange={() => toggleVisibility(handle.id, handle.is_visible)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteHandle(handle.id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {handles.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No social links yet. Add one above!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
