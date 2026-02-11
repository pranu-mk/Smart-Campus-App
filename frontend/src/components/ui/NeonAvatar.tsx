import { cn } from '@/lib/utils';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green';
  className?: string;
  url?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

const colors = {
  cyan: 'bg-gradient-to-br from-neon-cyan/20 to-slate-900/60 text-neon-cyan border-2 border-neon-cyan/50 shadow-[0_0_15px_rgba(0,255,255,0.3),inset_0_0_10px_rgba(0,255,255,0.1)]',
  purple: 'bg-gradient-to-br from-neon-purple/20 to-slate-900/60 text-neon-purple border-2 border-neon-purple/50 shadow-[0_0_15px_rgba(187,0,255,0.3),inset_0_0_10px_rgba(187,0,255,0.1)]',
  pink: 'bg-gradient-to-br from-neon-pink/20 to-slate-900/60 text-neon-pink border-2 border-neon-pink/50 shadow-[0_0_15px_rgba(255,20,147,0.3),inset_0_0_10px_rgba(255,20,147,0.1)]',
  green: 'bg-gradient-to-br from-neon-green/20 to-slate-900/60 text-neon-green border-2 border-neon-green/50 shadow-[0_0_15px_rgba(57,255,20,0.3),inset_0_0_10px_rgba(57,255,20,0.1)]',
};

export function NeonAvatar({ initials, glowColor = 'cyan', size = 'md', url }: AvatarProps) {
  return (
    <div className={`relative rounded-full border-2 border-neon-${glowColor} ...`}>
      {url ? (
        <img 
          src={url} 
          alt={initials} 
          className="w-full h-full rounded-full object-cover" 
          onError={(e) => (e.currentTarget.style.display = 'none')} // Fallback if URL fails
        />
      ) : (
        <span className="font-bold">{initials}</span>
      )}
    </div>
  );
}