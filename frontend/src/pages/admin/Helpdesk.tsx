import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, MessageCircle, Clock, CheckCircle, X, Eye, Send, Loader2, User } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://smart-campus-backend-app.onrender.com/api';

export function HelpdeskPage() {
  const [ticketList, setTicketList] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({ openTickets: 0, inProgress: 0, resolvedToday: 0 });
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
      if (res.data.success) {
        setTicketList(res.data.tickets);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error("Failed to load helpdesk data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTicket || processing) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/helpdesk/${selectedTicket.id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchHelpdeskData();
      setSelectedTicket((prev: any) => ({ ...prev, status }));
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedTicket || processing) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/helpdesk/${selectedTicket.id}`, 
        { 
          status: 'In Progress', 
          admin_reply: reply,
          admin_name: "Admin Support"
        }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply('');
      setShowDetailModal(false);
      await fetchHelpdeskData();
    } catch (err) {
      console.error("Reply failed", err);
      alert("System Error: Could not dispatch resolution.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-neon-cyan" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Helpdesk</h1>
        <p className="text-muted-foreground mt-1">Support ticket management oversight active.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Tickets', value: summary.openTickets, icon: MessageCircle, color: 'cyan' },
          { label: 'In Progress', value: summary.inProgress, icon: Clock, color: 'purple' },
          { label: 'Resolved Today', value: summary.resolvedToday, icon: CheckCircle, color: 'green' },
          { label: 'System Health', value: 'Optimal', icon: Headphones, color: 'pink' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <NeonCard glowColor={stat.color as any} className="text-center">
              <stat.icon className={`w-8 h-8 mx-auto text-neon-${stat.color} mb-2`} />
              <p className="text-2xl font-bold font-orbitron text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      <NeonCard glowColor="cyan">
        <h3 className="font-bold text-foreground mb-4 font-orbitron text-left">Live Support Queue</h3>
        <div className="space-y-3">
          {ticketList.map((ticket, i) => (
            <motion.div 
              key={ticket.id} 
              className="p-3 rounded-lg bg-muted/30 flex justify-between items-center hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{ticket.title}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-neon-purple text-neon-purple uppercase font-bold">{ticket.userRole}</span>
                </div>
                <p className="text-sm text-muted-foreground">{ticket.userName} • {ticket.department}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={ticket.status} />
                <span className="text-xs text-neon-cyan font-mono">{ticket.customId}</span>
                <GlowButton variant="cyan" size="sm" onClick={() => { setSelectedTicket(ticket); setShowDetailModal(true); }}>
                  <Eye className="w-4 h-4" />
                </GlowButton>
              </div>
            </motion.div>
          ))}
        </div>
      </NeonCard>

      <AnimatePresence>
        {showDetailModal && selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between flex-shrink-0">
                <div className="text-left">
                  <span className="text-xs text-neon-cyan font-mono">{selectedTicket.customId}</span>
                  <h2 className="text-xl font-bold font-orbitron text-foreground">{selectedTicket.title}</h2>
                </div>
                <X className="w-5 h-5 cursor-pointer text-muted-foreground" onClick={() => setShowDetailModal(false)} />
              </div>

              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">Raised by {selectedTicket.userRole}</p>
                    <p className="font-medium text-foreground">{selectedTicket.userName} ({selectedTicket.department})</p>
                  </div>
                  <StatusBadge status={selectedTicket.status} />
                </div>

                {/* Conversation History Thread */}
                <div className="space-y-4">
                  {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                    selectedTicket.messages.map((msg: any, idx: number) => (
                      <div key={idx} className={`flex ${msg.sender === 'student' ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[85%] ${msg.sender === 'student' ? 'order-1' : 'order-2'}`}>
                          <div className={`flex items-center gap-2 mb-1 ${msg.sender === 'student' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${msg.sender === 'student' ? 'bg-neon-purple' : 'bg-neon-cyan'}`}>
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {msg.senderName || (msg.sender === 'student' ? 'Student' : 'Admin')}
                            </span>
                            <span className="text-[10px] text-muted-foreground opacity-50">{msg.time}</span>
                          </div>
                          <div className={`p-3 rounded-xl text-left text-sm leading-relaxed ${
                            msg.sender === 'student' 
                              ? 'bg-muted/40 border border-neon-purple/20 text-foreground' 
                              : 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Fallback to original description if no message thread found */
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-left">
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Original Issue</p>
                      <p className="text-sm text-foreground leading-relaxed italic">"{selectedTicket.description}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-border/50 space-y-4 flex-shrink-0">
                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Update Status</label>
                  <div className="flex flex-wrap gap-2">
                    {['Open', 'In Progress', 'Resolved'].map((s) => (
                      <GlowButton 
                        key={s} 
                        variant={selectedTicket.status.toLowerCase() === s.toLowerCase() ? 'cyan' : 'purple'} 
                        size="md" 
                        disabled={processing}
                        onClick={() => handleUpdateStatus(s)}
                      >
                        {s}
                      </GlowButton>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Official Response</label>
                  <textarea
                    value={reply} onChange={(e) => setReply(e.target.value)}
                    placeholder="Type message to user..." rows={2}
                    className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-neon-cyan resize-none"
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
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}