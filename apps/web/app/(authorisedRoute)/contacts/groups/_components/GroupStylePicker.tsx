// /components/groups/GroupStylePicker.tsx
'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@codexcrm/ui';

interface GroupStylePickerProps {
  selectedColor: string;
  onColorSelect: (color: string) => void;
  selectedEmoji: string;
  onEmojiSelect: (emoji: string) => void;
}

export const PRESET_COLORS = [
  '#F0FDFF', '#FEF3C7', '#E0F2FE', '#F3E8FF', '#DCFCE7',
  '#DBEAFE', '#FEF08A', '#D1FAE5', '#CFFAFE', '#FEFCE8',
] as const;

export const PRESET_EMOJIS = [
  '⭐', '🎯', '🏆', '🆕', '🧘', '💆', '⚠️', '✅', '🔥', '💎', '📞', '💪', '🌟', '❤️', '🚨', '📅', '👑', '🎉', '🔔', '⏰', '🌱', '🎖️', '💯', '📊', '🚀', '💚', '⚡', '🎊', '🏅', '👍', '🌸', '💤', '🎈', '🔴', '🟡', '🟢', '💜', '📝',
] as const;

export function GroupStylePicker({
  selectedColor,
  onColorSelect,
  selectedEmoji,
  onEmojiSelect,
}: GroupStylePickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="font-medium text-gray-700">Color</Label>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onColorSelect(color)}
              className={cn(
                'w-full h-8 rounded-md border-2 flex items-center justify-center transition-all',
                selectedColor === color ? 'border-blue-500 scale-110' : 'border-transparent'
              )}
              style={{ backgroundColor: color }}
              aria-label={`Select color ${color}`}
            >
              {selectedColor === color && <Check className="h-4 w-4 text-gray-700" />}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label className="font-medium text-gray-700">Emoji</Label>
        <div className="grid grid-cols-8 gap-1 mt-2">
          {PRESET_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onEmojiSelect(emoji)}
              className={cn(
                'text-xl rounded-md flex items-center justify-center p-1 transition-all',
                selectedEmoji === emoji ? 'bg-blue-100 scale-110' : 'hover:bg-gray-100'
              )}
              aria-label={`Select emoji ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
