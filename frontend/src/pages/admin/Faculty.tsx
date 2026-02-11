import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, Eye, Shield, ShieldOff, Star,
  MessageSquare, CheckCircle, X, Mail, Phone, UserPlus,
} from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://smart-campus-backend-app.onrender.com/api';

export function FacultyPage() {
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/faculty`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) setFacultyList(res.data.data);
    } catch (err) {
      console.error("Error fetching faculty:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaculty = facultyList.filter((f) =>
    (f.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (f.department || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      // Optimistic Update: prevent the flash by setting it immediately
      const nextStatus = currentStatus === 'active' ? 'blocked' : 'active';
      
      const res = await axios.patch(`${API_URL}/admin/faculty/${id}/status`, 
        { status: currentStatus }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (res.data.success) {
        setFacultyList(prev => prev.map(f => 
          f.id === id ? { ...f, status: res.data.newStatus || nextStatus } : f
        ));
        
        // If modal is open for this faculty, update it too
        if (selectedFaculty?.id === id) {
          setSelectedFaculty((prev: any) => ({ ...prev, status: res.data.newStatus || nextStatus }));
        }
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  if (loading) return <div className="p-10 text-center font-orbitron text-neon-purple animate-pulse">Syncing Faculty Database...</div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Faculty Management</h1>
          <p className="text-muted-foreground mt-1">Manage {facultyList.length} faculty members</p>
        </div>
      </motion.div>

      <NeonCard glowColor="purple" hover={false}>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-neon-purple transition-all"
          />
        </div>
      </NeonCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((fac, i) => (
          <motion.div key={fac.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <NeonCard glowColor={(fac.status || 'active') === 'active' ? 'purple' : 'pink'} className="relative overflow-hidden">
              <div className="absolute top-4 right-4"><StatusBadge status={fac.status || 'active'} /></div>
              <div className="flex flex-col items-center text-center">
                <NeonAvatar initials={fac.name ? fac.name.split(' ').map((n:any) => n[0]).join('') : 'F'} glowColor={fac.status === 'active' ? 'purple' : 'pink'} size="lg" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">{fac.name}</h3>
                <p className="text-sm text-muted-foreground">{fac.designation}</p>
                <p className="text-sm text-neon-cyan mt-1">{fac.department}</p>
                
                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-1 text-neon-yellow"><Star className="w-4 h-4" /><span>{fac.rating || '0'}</span></div>
                  <div className="flex items-center gap-1 text-neon-purple"><MessageSquare className="w-4 h-4" /><span>{fac.assignedComplaints || '0'}</span></div>
                  <div className="flex items-center gap-1 text-neon-green"><CheckCircle className="w-4 h-4" /><span>{fac.resolvedComplaints || '0'}</span></div>
                </div>

                <div className="flex gap-2 mt-6 w-full">
                  <GlowButton variant="cyan" size="sm" className="flex-1" onClick={() => { setSelectedFaculty(fac); setShowModal(true); }}>
                    <Eye className="w-4 h-4" /> View
                  </GlowButton>
                  <GlowButton variant={fac.status === 'active' ? 'pink' : 'green'} size="sm" onClick={() => toggleStatus(fac.id, fac.status)}>
                    {fac.status === 'active' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                  </GlowButton>
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showModal && selectedFaculty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass rounded-2xl neon-border-purple overflow-hidden p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <h2 className="text-xl font-bold font-orbitron">Faculty Profile</h2>
                <X className="cursor-pointer text-muted-foreground hover:text-white" onClick={() => setShowModal(false)} />
              </div>
              <div className="flex items-center gap-4">
                <NeonAvatar initials={selectedFaculty.name ? selectedFaculty.name.split(' ').map((n:any) => n[0]).join('') : 'F'} glowColor="purple" size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedFaculty.name}</h3>
                  <StatusBadge status={selectedFaculty.status || 'active'} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">Email</p><p className="text-white">{selectedFaculty.email}</p></div>
                <div><p className="text-muted-foreground">Phone</p><p className="text-white">{selectedFaculty.phone}</p></div>
                <div><p className="text-muted-foreground">Dept</p><p className="text-white">{selectedFaculty.department}</p></div>
                <div><p className="text-muted-foreground">Rating</p><p className="text-white">{selectedFaculty.rating || '0'} / 5.0</p></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}