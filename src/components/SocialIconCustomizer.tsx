import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { SocialIcon } from './SocialIcon';

export interface IconSettings {
  position: 'above' | 'below';
  style: 'brand' | 'monochrome' | 'outline';
  shape: 'circle' | 'rounded' | 'square';
  size: number;
  spacing: number;
  alignment: 'left' | 'center' | 'right';
  hover: 'scale' | 'underline' | 'none';
  color: string;
}

interface SocialIconCustomizerProps {
  profileId: string;
  onSettingsChange?: (settings: IconSettings) => void;
}

export const SocialIconCustomizer: React.FC<SocialIconCustomizerProps> = ({ 
  profileId, 
  onSettingsChange 
}) => {
  const [settings, setSettings] = useState<IconSettings>({
    position: 'below',
    style: 'brand',
    shape: 'circle',
    size: 32,
    spacing: 12,
    alignment: 'center',
    hover: 'scale',
    color: '#000000',
  });
  const { toast } = useToast();
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    fetchSettings();
  }, [profileId]);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('social_icon_position, social_icon_style, social_icon_shape, social_icon_size, social_icon_spacing, social_icon_alignment, social_icon_hover, social_icon_color')
      .eq('id', profileId)
      .single();

    if (error || !data) return;

    const newSettings = {
      position: data.social_icon_position || 'below',
      style: data.social_icon_style || 'brand',
      shape: data.social_icon_shape || 'circle',
      size: data.social_icon_size || 32,
      spacing: data.social_icon_spacing || 12,
      alignment: data.social_icon_alignment || 'center',
      hover: data.social_icon_hover || 'scale',
      color: data.social_icon_color || '#000000',
    };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);
  };

  const updateSetting = (key: keyof IconSettings, value: any) => {
    // Instant local update for optimistic UI
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange?.(newSettings);

    // Debounced save to Supabase
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      const dbKey = `social_icon_${key}`;
      const { error } = await supabase
        .from('profiles')
        .update({ [dbKey]: value })
        .eq('id', profileId);

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    }, 400);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Icon Customization</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="p-4 bg-muted rounded-lg">
          <Label className="mb-2 block">Preview</Label>
          <div
            className={`flex gap-${settings.spacing / 4}`}
            style={{
              justifyContent: settings.alignment === 'left' ? 'flex-start' : settings.alignment === 'right' ? 'flex-end' : 'center',
              gap: `${settings.spacing}px`,
            }}
          >
            {['instagram', 'youtube', 'tiktok'].map(platform => (
              <SocialIcon
                key={platform}
                platform={platform}
                size={settings.size}
                style={settings.style}
                shape={settings.shape}
                hover={settings.hover}
                color={settings.color}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Position */}
          <div>
            <Label>Position on Page</Label>
            <Select value={settings.position} onValueChange={(v) => updateSetting('position', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above Links</SelectItem>
                <SelectItem value="below">Below Links</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Style */}
          <div>
            <Label>Icon Style</Label>
            <Select value={settings.style} onValueChange={(v) => updateSetting('style', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand">Brand Colors</SelectItem>
                <SelectItem value="monochrome">Monochrome</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shape */}
          <div>
            <Label>Icon Shape</Label>
            <Select value={settings.shape} onValueChange={(v) => updateSetting('shape', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="rounded">Rounded</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alignment */}
          <div>
            <Label>Alignment</Label>
            <Select value={settings.alignment} onValueChange={(v) => updateSetting('alignment', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hover Effect */}
          <div>
            <Label>Hover Effect</Label>
            <Select value={settings.hover} onValueChange={(v) => updateSetting('hover', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scale">Scale</SelectItem>
                <SelectItem value="underline">Fade</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Color (only for monochrome/outline) */}
          {(settings.style === 'monochrome' || settings.style === 'outline') && (
            <div>
              <Label>Custom Color</Label>
              <Input
                type="color"
                value={settings.color}
                onChange={(e) => updateSetting('color', e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Size Slider */}
        <div>
          <Label>Icon Size: {settings.size}px</Label>
          <Slider
            min={16}
            max={48}
            step={4}
            value={[settings.size]}
            onValueChange={(v) => updateSetting('size', v[0])}
            className="mt-2"
          />
        </div>

        {/* Spacing Slider */}
        <div>
          <Label>Spacing: {settings.spacing}px</Label>
          <Slider
            min={4}
            max={32}
            step={4}
            value={[settings.spacing]}
            onValueChange={(v) => updateSetting('spacing', v[0])}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};
