import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, X, Loader2, Trash2 } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://smart-campus-backend-app.onrender.com/api';

export function PollsPage() {
  const [pollList, setPollList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    description: '',
    category: 'Campus',
    options: ['', '', '', ''],
    endDate: '',
  });

  // --- 1. FETCH LIVE POLLS ---
  const fetchAdminPolls = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/polls`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPollList(res.data);
    } catch (err) {
      toast({ title: "Error", description: "Failed to fetch polls from database", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminPolls();
  }, []);

  // --- 2. CREATE POLL ---
  const handleCreatePoll = async () => {
    const validOptions = newPoll.options.filter(o => o.trim());
    if (!newPoll.question || validOptions.length < 2) {
      return toast({ title: "Validation Error", description: "Question and at least 2 options are required." });
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/polls`, {
        title: newPoll.question,
        description: newPoll.description || "Campus Poll",
        category: newPoll.category,
        deadline: newPoll.endDate || "No deadline",
        options: validOptions
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({ title: "Success", description: "Poll published successfully." });
      setShowAddModal(false);
      setNewPoll({ question: '', description: '', category: 'Campus', options: ['', '', '', ''], endDate: '' });
      fetchAdminPolls();
    } catch (err) {
      toast({ title: "Error", description: "Failed to save poll to database.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  // --- 3. STATUS MANAGEMENT (CLOSE POLL) ---
  const handleClosePoll = async (pollId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/polls/${pollId}/close`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Poll Closed", description: "Poll is now read-only for students." });
      fetchAdminPolls();
    } catch (err) {
      toast({ title: "Error", description: "Failed to close poll", variant: "destructive" });
    }
  };

  // --- 4. DELETE POLL (PERMANENT) ---
  const handleDeletePoll = async (pollId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this poll? All related student votes will be lost.")) return;

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/polls/${pollId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({ title: "Deleted", description: "Poll and all associated data removed." });
      setPollList(prev => prev.filter(p => p.id !== pollId));
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete poll.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newPoll.options];
    newOptions[index] = value;
    setNewPoll({ ...newPoll, options: newOptions });
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-neon-cyan w-8 h-8" />
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div className="text-left">
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">
            Polls & Voting
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage {pollList.length} campus polls from the database
          </p>
        </div>
        <GlowButton 
          variant="gradient" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
        >
          Create Poll
        </GlowButton>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pollList.map((poll, i) => {
          const totalVotes = poll.options.reduce((sum: number, opt: any) => sum + opt.votes, 0);
          
          return (
            <motion.div
              key={poll.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <NeonCard glowColor={poll.status === 'active' ? 'cyan' : 'purple'}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={poll.status} />
                      <button 
                        onClick={() => handleDeletePoll(poll.id)}
                        disabled={processing}
                        className="p-1.5 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                        title="Delete Poll Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{totalVotes} votes</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-foreground text-left">{poll.title}</h3>

                  <div className="space-y-3">
                    {poll.options.map((option: any) => {
                      const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                      const maxVotes = Math.max(...poll.options.map((o: any) => o.votes));
                      const isWinning = option.votes === maxVotes && maxVotes > 0;
                      
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className={isWinning ? 'text-neon-cyan font-medium' : 'text-foreground'}>
                              {option.text}
                            </span>
                            <span className="text-muted-foreground">{option.votes} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1 }}
                              className={`absolute inset-y-0 left-0 rounded-full ${
                                isWinning ? 'bg-gradient-to-r from-neon-cyan to-neon-green' : 'bg-neon-purple/50'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="text-left">
                      <p className="text-xs text-muted-foreground uppercase tracking-tighter">{poll.category}</p>
                      <p className="text-xs text-muted-foreground">Ends: {poll.deadline}</p>
                    </div>
                    {poll.status === 'active' && (
                      <GlowButton 
                        variant="pink" 
                        size="sm"
                        onClick={() => handleClosePoll(poll.id)}
                      >
                        Close Poll
                      </GlowButton>
                    )}
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          );
        })}
      </div>

      {/* Create Poll Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-2xl neon-border-purple overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground text-left">Create New Poll</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4 text-left">
                <GlowInput 
                  label="Poll Question" 
                  placeholder="What is the topic?"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({...newPoll, question: e.target.value})}
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Options (Minimum 2)</label>
                  {newPoll.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan transition-colors mb-1"
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <select 
                    value={newPoll.category}
                    onChange={(e) => setNewPoll({...newPoll, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#0a0a1a] border border-border rounded-lg text-foreground focus:border-neon-cyan outline-none"
                  >
                    <option value="Placement">Placement</option>
                    <option value="Academic">Academic</option>
                    <option value="Campus">Campus</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <GlowInput 
                  label="End Date" 
                  type="date"
                  value={newPoll.endDate}
                  onChange={(e) => setNewPoll({...newPoll, endDate: e.target.value})}
                />
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleCreatePoll} disabled={processing}>
                    {processing ? "Syncing..." : "Create Poll"}
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}