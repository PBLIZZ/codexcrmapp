'use client';

import { PlusCircle, Loader2, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { createClient } from '@/lib/supabase/client';
import { api } from '@/lib/trpc';

const supabase = createClient();

// Common emojis for groups
const COMMON_EMOJIS = [
  '👥', '👨‍👩‍👧‍👦', '👨‍👨‍👧‍👧', '👩‍👩‍👧‍👦', '🫂', '🤝', '🏢', '🏫', '🏭',
  '🏠', '🏡', '🏘️', '🏙️', '🌆', '🌇', '🌃', '🌉', '🏛️', '🏪', '🏬',
  '🏨', '🏦', '🏥', '🏤', '🏣', '🏟️', '🏞️', '🏝️', '🏜️', '🏚️', '🏗️',
  '⛪', '🕌', '🕍', '⛩️', '🕋', '⛲', '⛺', '🏕️', '🗻', '🌋', '🌄', '🌅',
  '🌠', '🎆', '🎇', '🎑', '🏞️', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆',
  '🏙️', '🌃', '🌌', '🌉', '🌁', '⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️',
  '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
  '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭',
  '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️',
  '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰',
  '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣',
  '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿',
  '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '💊', '💉', '🩸', '🩹', '🩺', '🚪',
  '🛏️', '🛋️', '🪑', '🚽', '🚿', '🛁', '🧴', '🧷', '🧹', '🧺', '🧻', '🧼',
  '🧽', '🧯', '🛒', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️',
  '🔭', '🔬', '🕳️', '💊', '💉', '🩸', '🩹', '🩺', '🚪', '🛏️', '🛋️', '🪑',
  '🚽', '🚿', '🛁', '🧴', '🧷', '🧹', '🧺', '🧻', '🧼', '🧽', '🧯', '🛒',
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛',
  '🚜', '🦯', '🦽', '🦼', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍',
  '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈',
  '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀',
  '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧',
  '🚦', '🚥', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢',
  '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺',
  '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦',
  '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🕋', '⛩️', '🛤️',
  '🛣️', '🗾', '🎑', '🏞️', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙️',
  '🌃', '🌌', '🌉', '🌁', '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️',
  '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
  '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭',
  '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️',
  '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰',
  '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣',
  '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿',
  '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '💊', '💉', '🩸', '🩹', '🩺', '🚪',
  '🛏️', '🛋️', '🪑', '🚽', '🚿', '🛁', '🧴', '🧷', '🧹', '🧺', '🧻', '🧼',
  '🧽', '🧯', '🛒', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️',
  '🔭', '🔬', '🕳️', '💊', '💉', '🩸', '🩹', '🩺', '🚪', '🛏️', '🛋️', '🪑',
  '🚽', '🚿', '🛁', '🧴', '🧷', '🧹', '🧺', '🧻', '🧼', '🧽', '🧯', '🛒'
];

// Most commonly used emojis for groups
const POPULAR_EMOJIS = ['👥', '👨‍👩‍👧‍👦', '🫂', '🤝', '🏢', '🏫', '🏭', '🏠', '📱', '💻', '💰', '📊', '📈', '🔍', '🎯', '🚀', '⭐', '🌟', '💡', '📝', '📚', '🎓', '🏆', '🎮', '🎨', '🎬', '🎵', '🍔', '🍕', '🍷', '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥊', '🥋', '🏋️', '🤸', '🤼', '🤽', '🤾', '🤺', '⛷️', '🏂', '🏊', '🚴', '🧘', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🎲', '🎯', '🎳', '🎮', '🎰', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '💺', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🚏', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '🏕️', '⛺', '🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🕍', '🕋', '⛩️', '🛤️', '🛣️', '🗾', '🎑', '🏞️', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙️', '🌃', '🌌', '🌉', '🌁'];

export function QuickCreateGroupButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('👥');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmojis, setFilteredEmojis] = useState(POPULAR_EMOJIS);
  const router = useRouter();
  const utils = api.useUtils();

  // Filter emojis based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredEmojis(POPULAR_EMOJIS);
      return;
    }

    const filtered = COMMON_EMOJIS.filter(emoji => {
      // This is a simple search - in a real app, you might want to use a more sophisticated
      // search that includes emoji descriptions/keywords
      return emoji.includes(searchTerm);
    });
    
    setFilteredEmojis(filtered.length > 0 ? filtered : POPULAR_EMOJIS);
  }, [searchTerm]);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error('Group name is required');
      return;
    }

    try {
      setIsCreating(true);

      // Get the current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error('No authenticated user found');
        toast.error('Authentication Error', {
          description: 'You must be logged in to create a group.',
        });
        return;
      }

      // Direct insertion to the groups table
      const { data, error } = await supabase
        .from('groups')
        .insert({
          name: groupName.trim(),
          color: '#c084fc', // Default purple color
          emoji: selectedEmoji,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating group:', error);
        toast.error('Failed to Create Group', {
          description: error.message || 'An unexpected error occurred',
        });
        return;
      }

      console.log('Group created successfully:', data);

      // Show success toast
      toast.success('Group Created', {
        description: `"${groupName}" has been created successfully.`,
      });

      // Reset form
      setGroupName('');
      setSelectedEmoji('👥');
      setSearchTerm('');
      setIsOpen(false);

      // Invalidate groups cache to refresh the list
      utils.groups.list.invalidate();
      utils.groups.list.refetch();
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error('Error', {
        description: 'Failed to create group. Please try again.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className="bg-teal-400 hover:bg-teal-500 text-white"
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Quick Create Group
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Create New Group</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="emoji-select">Emoji</Label>
            <div className="flex items-center space-x-2 mb-2">
              <div
                className="flex items-center justify-center h-10 w-10 rounded-md border border-gray-300 text-2xl"
              >
                {selectedEmoji}
              </div>
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    id="emoji-search"
                    placeholder="Search emoji..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="h-32 overflow-y-auto border rounded-md p-2 grid grid-cols-8 gap-1">
              {filteredEmojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  className={`text-xl p-1 rounded hover:bg-gray-100 ${
                    selectedEmoji === emoji ? 'bg-gray-200' : ''
                  }`}
                  onClick={() => setSelectedEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          
          <Button
            className="w-full"
            onClick={handleCreateGroup}
            disabled={isCreating || !groupName.trim()}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Save Group'
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
