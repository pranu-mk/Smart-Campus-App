import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  pending: 'bg-neon-yellow/20 text-neon-yellow border-neon-yellow/50',
  assigned: 'bg-neon-blue/20 text-neon-blue border-neon-blue/50',
  in_progress: 'bg-neon-purple/20 text-neon-purple border-neon-purple/50',
  resolved: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  escalated: 'bg-destructive/20 text-destructive border-destructive/50',
  closed: 'bg-muted text-muted-foreground border-border',
  active: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  blocked: 'bg-destructive/20 text-destructive border-destructive/50',
  inactive: 'bg-muted text-muted-foreground border-border',
  upcoming: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50',
  ongoing: 'bg-neon-purple/20 text-neon-purple border-neon-purple/50',
  completed: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  cancelled: 'bg-destructive/20 text-destructive border-destructive/50',
  lost: 'bg-destructive/20 text-destructive border-destructive/50',
  found: 'bg-neon-green/20 text-neon-green border-neon-green/50',
  claimed: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // CRASH FIX: Default to 'unknown' if status is missing to prevent toLowerCase() error
  const safeStatus = (status || 'unknown').toLowerCase();

  const variants: Record<string, string> = {
    active: 'bg-neon-green/10 text-neon-green border-neon-green/50 shadow-[0_0_10px_rgba(0,255,136,0.2)]',
    blocked: 'bg-neon-pink/10 text-neon-pink border-neon-pink/50 shadow-[0_0_10px_rgba(255,0,212,0.2)]',
    pending: 'bg-neon-yellow/10 text-neon-yellow border-neon-yellow/50 shadow-[0_0_10px_rgba(255,184,0,0.2)]',
    resolved: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50 shadow-[0_0_10px_rgba(0,242,255,0.2)]',
    unknown: 'bg-muted/10 text-muted border-muted/50',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full text-[10px] font-bold font-orbitron border uppercase tracking-wider',
        variants[safeStatus] || variants.unknown,
        className
      )}
    >
      {status || 'Unknown'}
    </span>
  );
}