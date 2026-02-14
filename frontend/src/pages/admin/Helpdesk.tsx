import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Headphones,
  MessageCircle,
  Clock,
  CheckCircle,
  X,
  Eye,
  Send,
  Loader2,
  User
} from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://smart-campus-backend-app.onrender.com/api';

export function HelpdeskPage() {
  const [ticketList, setTicketList] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    openTickets: 0,
    inProgress: 0,
    resolvedToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchHelpdeskData();
  }, []);

  const fetchHelpdeskData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/helpdesk`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setTicketList(res.data.tickets || []);
        setSummary(
          res.data.summary || {
            openTickets: 0,
            inProgress: 0,
            resolvedToday: 0
          }
        );
      }
    } catch (err) {
      console.error('Failed to load helpdesk data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket || processing) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/admin/helpdesk/${selectedTicket.id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchHelpdeskData();
      setSelectedTicket((prev: any) =>
        prev ? { ...prev, status } : null
      );
    } catch (err) {
      console.error('Status update failed', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedTicket || processing) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${API_URL}/admin/helpdesk/${selectedTicket.id}`,
        {
          status: 'In Progress',
          admin_reply: reply,
          admin_name: 'Admin Support'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReply('');
      setShowDetailModal(false);
      await fetchHelpdeskData();
    } catch (err) {
      console.error('Reply failed', err);
      alert('System Error: Could not dispatch resolution.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-neon-cyan" />
      </div>
    );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">
          Helpdesk
        </h1>
        <p className="text-muted-foreground mt-1">
          Support ticket management oversight active.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Open Tickets',
            value: summary?.openTickets ?? 0,
            icon: MessageCircle,
            color: 'cyan'
          },
          {
            label: 'In Progress',
            value: summary?.inProgress ?? 0,
            icon: Clock,
            color: 'purple'
          },
          {
            label: 'Resolved Today',
            value: summary?.resolvedToday ?? 0,
            icon: CheckCircle,
            color: 'green'
          },
          {
            label: 'System Health',
            value: 'Optimal',
            icon: Headphones,
            color: 'pink'
          }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <NeonCard glowColor={stat.color as any} className="text-center">
              <stat.icon
                className={`w-8 h-8 mx-auto text-neon-${stat.color} mb-2`}
              />
              <p className="text-2xl font-bold font-orbitron text-foreground">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Ticket List */}
      <NeonCard glowColor="cyan">
        <h3 className="font-bold text-foreground mb-4 font-orbitron text-left">
          Live Support Queue
        </h3>

        <div className="space-y-3">
          {ticketList?.map((ticket: any) => (
            <motion.div
              key={ticket?.id}
              className="p-3 rounded-lg bg-muted/30 flex justify-between items-center hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">
                    {ticket?.title || 'Untitled'}
                  </p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-neon-purple text-neon-purple uppercase font-bold">
                    {ticket?.userRole || 'User'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {ticket?.userName || 'Unknown'} •{' '}
                  {ticket?.department || 'N/A'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={ticket?.status || 'Open'} />
                <span className="text-xs text-neon-cyan font-mono">
                  {ticket?.customId || '-'}
                </span>
                <GlowButton
                  variant="cyan"
                  size="sm"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setShowDetailModal(true);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </GlowButton>
              </div>
            </motion.div>
          ))}
        </div>
      </NeonCard>

      {/* Modal */}
      <AnimatePresence>
        {showDetailModal && selectedTicket && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-border/50 flex justify-between">
                <div>
                  <span className="text-xs text-neon-cyan font-mono">
                    {selectedTicket?.customId}
                  </span>
                  <h2 className="text-xl font-bold font-orbitron text-foreground">
                    {selectedTicket?.title}
                  </h2>
                </div>
                <X
                  className="w-5 h-5 cursor-pointer text-muted-foreground"
                  onClick={() => setShowDetailModal(false)}
                />
              </div>

              {/* Update Status */}
              <div className="p-6 border-t border-border/50 space-y-4">
                <label className="text-xs font-bold uppercase text-muted-foreground">
                  Update Status
                </label>

                <div className="flex flex-wrap gap-2">
                  {['Open', 'In Progress', 'Resolved'].map((s) => {
                    const currentStatus =
                      (selectedTicket?.status || '').toString().toLowerCase();

                    return (
                      <GlowButton
                        key={s}
                        variant={
                          currentStatus === s.toLowerCase()
                            ? 'cyan'
                            : 'purple'
                        }
                        size="md"
                        disabled={processing}
                        onClick={() => handleUpdateStatus(s)}
                      >
                        {s}
                      </GlowButton>
                    );
                  })}
                </div>

                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type message to user..."
                  rows={2}
                  className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-sm text-foreground resize-none"
                />

                <GlowButton
                  variant="gradient"
                  className="w-full"
                  icon={<Send className="w-4 h-4" />}
                  disabled={processing}
                  onClick={handleSendReply}
                >
                  {processing ? 'Processing...' : 'Dispatch Resolution'}
                </GlowButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
