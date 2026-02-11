import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, AlertCircle, Bell, Megaphone, Paperclip, Calendar, X, Eye, Download, Edit, Trash2, Loader2 } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { departments } from '@/data/admin/dummyData';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://smart-campus-backend-app.onrender.com/api';

export function NoticesPage() {
  const [noticeList, setNoticeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any | null>(null);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    department: 'all', // Maps to target_role
    priority: 'general', // Maps to type ENUM
  });

  // --- 1. FETCH LIVE NOTICES ---
  const fetchNotices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/notices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setNoticeList(res.data.notices);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load notices from database", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return { color: 'pink', icon: AlertCircle, bg: 'bg-destructive/10 border-destructive/30' };
      case 'important':
      case 'academic':
        return { color: 'purple', icon: Megaphone, bg: 'bg-neon-purple/10 border-neon-purple/30' };
      default:
        return { color: 'cyan', icon: Bell, bg: 'bg-neon-cyan/10 border-neon-cyan/30' };
    }
  };

  // --- 2. POST NOTICE (ALIGNED WITH DB ENUMS) ---
  const handlePostNotice = async () => {
    if (!newNotice.title || !newNotice.content) {
      return toast({ title: "Validation Error", description: "Title and Content are required." });
    }
    
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        title: newNotice.title,
        content: newNotice.content,
        category: newNotice.priority, // Sends: general, academic, event, placement, or urgent
        visibility: newNotice.department // Sends: all, student, faculty, or admin
      };

      const res = await axios.post(`${API_URL}/admin/notices`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast({ title: "Success", description: "Notice published globally." });
        await fetchNotices();
        setShowAddModal(false);
        setNewNotice({ title: '', content: '', department: 'all', priority: 'general' });
      }
    } catch (err) {
      toast({ title: "Failed", description: "Database error: Ensure category matches allowed types.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  // --- 3. DELETE NOTICE ---
  const handleDeleteNotice = async (id: number) => {
    if (!window.confirm("Delete this notice permanently?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/notices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Deleted", description: "Notice removed from all dashboards." });
      setNoticeList(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      toast({ title: "Error", description: "Deletion failed", variant: "destructive" });
    }
  };

  const handleViewNotice = (notice: any) => {
    setSelectedNotice(notice);
    setShowViewModal(true);
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-neon-cyan w-8 h-8" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Notice Board</h1>
          <p className="text-muted-foreground mt-1">Manage campus announcements dynamically</p>
        </div>
        <GlowButton variant="gradient" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>Post Notice</GlowButton>
      </motion.div>

      <div className="space-y-4">
        {noticeList.length === 0 ? (
          <NeonCard glowColor="cyan" hover={false} className="text-center py-10 opacity-60">No active notices found in database.</NeonCard>
        ) : (
          noticeList.map((notice, i) => {
            const { color, icon: Icon, bg } = getPriorityStyles(notice.category || notice.priority);
            return (
              <motion.div key={notice.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <NeonCard glowColor={color as 'cyan' | 'purple' | 'pink'}>
                  <div className="flex gap-4">
                    <div className={`p-3 rounded-xl ${bg} flex-shrink-0`}><Icon className={`w-6 h-6 text-neon-${color}`} /></div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${bg} text-neon-${color} uppercase tracking-wider`}>{notice.category || notice.priority}</span>
                        <span className="text-xs text-muted-foreground uppercase">{notice.visibility || notice.department}</span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{notice.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{notice.content}</p>
                      <div className="flex items-center flex-wrap gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground"><Calendar className="w-4 h-4" /><span>Posted: {new Date(notice.date).toLocaleDateString()}</span></div>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      <GlowButton variant="cyan" size="sm" onClick={() => handleViewNotice(notice)}><Eye className="w-4 h-4" /> View</GlowButton>
                      <GlowButton variant="pink" size="sm" onClick={() => handleDeleteNotice(notice.id)}><Trash2 className="w-4 h-4" /></GlowButton>
                    </div>
                  </div>
                </NeonCard>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Post Notice Modal - FIXED ENUM ALIGNMENT */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass rounded-2xl neon-border-purple overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground text-left">Post New Notice</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-muted/50 rounded-lg"><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>
              <div className="p-6 space-y-4 text-left">
                <GlowInput label="Notice Title" placeholder="Enter notice title" value={newNotice.title} onChange={(e) => setNewNotice({...newNotice, title: e.target.value})} />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Content</label>
                  <textarea placeholder="Enter notice content..." value={newNotice.content} onChange={(e) => setNewNotice({...newNotice, content: e.target.value})} rows={4} className="w-full px-4 py-3 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-neon-cyan resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Visibility (DB Role)</label>
                    <select value={newNotice.department} onChange={(e) => setNewNotice({...newNotice, department: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan">
                      <option value="all">All Roles</option>
                      <option value="student">Students Only</option>
                      <option value="faculty">Faculty Only</option>
                      <option value="admin">Admins Only</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Category (DB Type)</label>
                    <select value={newNotice.priority} onChange={(e) => setNewNotice({...newNotice, priority: e.target.value})} className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan">
                      <option value="general">General</option>
                      <option value="academic">Academic</option>
                      <option value="event">Event</option>
                      <option value="placement">Placement</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handlePostNotice} disabled={processing}>{processing ? "Syncing..." : "Post Notice"}</GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowAddModal(false)}>Cancel</GlowButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Notice Modal */}
      <AnimatePresence>
        {showViewModal && selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowViewModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-1 rounded uppercase tracking-wider ${selectedNotice.category === 'urgent' ? 'bg-destructive/10 text-destructive' : 'bg-neon-cyan/10 text-neon-cyan'}`}>{selectedNotice.category || selectedNotice.priority}</span>
                <X className="w-5 h-5 cursor-pointer text-muted-foreground" onClick={() => setShowViewModal(false)} />
              </div>
              <div className="p-6 space-y-4 text-left">
                <h3 className="text-xl font-bold text-foreground">{selectedNotice.title}</h3>
                <p className="text-sm text-muted-foreground uppercase">{selectedNotice.visibility || selectedNotice.department}</p>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50"><p className="text-foreground whitespace-pre-wrap">{selectedNotice.content}</p></div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-xs text-muted-foreground uppercase">Posted On</p><p className="text-foreground mt-1">{new Date(selectedNotice.date).toLocaleDateString()}</p></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}