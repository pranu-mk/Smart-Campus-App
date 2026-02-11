import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Users, Calendar, Award, X, Settings, Loader2 } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function ClubsPage() {
  const [clubList, setClubList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedClub, setSelectedClub] = useState<any | null>(null);
  const [newClub, setNewClub] = useState({
    name: '',
    description: '',
    category: 'Technical',
    president: '',
  });

  // --- 1. FETCH DYNAMIC DATA ---
  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/clubs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setClubList(res.data.clubs);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load clubs from database", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredClubs = clubList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryColors: Record<string, 'cyan' | 'purple' | 'pink' | 'green'> = {
    Technical: 'cyan',
    Cultural: 'purple',
    Arts: 'pink',
    Literary: 'green',
  };

  // --- 2. ADD NEW CLUB ---
  const handleAddClub = async () => {
    if (!newClub.name || !newClub.category) {
      return toast({ title: "Required Fields", description: "Please enter a Name and Category." });
    }

    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_URL}/admin/clubs`, newClub, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        toast({ title: "Club Created", description: `${newClub.name} has been added successfully.` });
        await fetchClubs(); // Refresh list from DB
        setShowAddModal(false);
        setNewClub({ name: '', description: '', category: 'Technical', president: '' });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to save the new club.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  // --- 3. MANAGE STATUS (ACTIVATE/DEACTIVATE) ---
  const handleManageClub = (club: any) => {
    setSelectedClub(club);
    setShowManageModal(true);
  };

  const toggleClubStatus = async () => {
    if (!selectedClub || processing) return;
    const newStatus = selectedClub.status === 'active' ? 'inactive' : 'active';
    setProcessing(true);
    try {
      const res = await axios.patch(`${API_URL}/admin/clubs/${selectedClub.id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.data.success) {
        const updated = res.data.club;
        setClubList(prev => prev.map(c => c.id === updated.id ? { ...c, status: updated.status } : c));
        setSelectedClub({ ...selectedClub, status: updated.status });
        toast({ title: "Success", description: res.data.message });
      }
    } catch (err) {
      toast({ title: "Error", description: "Persistence failed", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  // --- 4. UPDATE MEMBER COUNT ---
  const updateClubMembers = async (delta: number) => {
    if (!selectedClub || processing) return;
    const newCount = Math.max(0, selectedClub.members + delta);
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_URL}/admin/clubs/${selectedClub.id}/details`, 
        { members: newCount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setSelectedClub({ ...selectedClub, members: newCount });
        setClubList(prev => prev.map(c => c.id === selectedClub.id ? { ...c, members: newCount } : c));
      }
    } catch (err) {
      toast({ title: "Update Failed", description: "Could not persist member change.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-neon-cyan" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Clubs & Organizations</h1>
          <p className="text-muted-foreground mt-1">Manage {clubList.length} database-driven campus clubs</p>
        </div>
        <GlowButton variant="gradient" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>Add Club</GlowButton>
      </motion.div>

      <NeonCard glowColor="cyan" hover={false}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text" placeholder="Search clubs..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none"
          />
        </div>
      </NeonCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club, i) => (
          <motion.div key={club.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <NeonCard glowColor={categoryColors[club.category] || 'cyan'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded bg-neon-${categoryColors[club.category] || 'cyan'}/10 text-neon-${categoryColors[club.category] || 'cyan'} uppercase`}>
                    {club.category}
                  </span>
                  <StatusBadge status={club.status} />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-foreground">{club.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{club.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center py-4 border-y border-border/50">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-neon-cyan">
                      <Users className="w-4 h-4" />
                      <span className="text-xl font-bold font-orbitron">{club.members}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Members</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-neon-purple">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xl font-bold font-orbitron">{club.upcomingEvents || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-neon-green">
                      <Award className="w-4 h-4" />
                      <span className="text-xl font-bold font-orbitron">{club.established}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Est.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground">President</p>
                    <p className="text-sm font-medium text-foreground">{club.president || 'N/A'}</p>
                  </div>
                  <GlowButton variant="cyan" size="sm" onClick={() => handleManageClub(club)}>Manage</GlowButton>
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Add Club Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md glass rounded-2xl neon-border-purple overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Add New Club</h2>
                <X className="w-5 h-5 cursor-pointer text-muted-foreground" onClick={() => setShowAddModal(false)} />
              </div>
              <div className="p-6 space-y-4 text-left">
                <GlowInput label="Club Name" placeholder="e.g. Robotics Club" value={newClub.name} onChange={(e) => setNewClub({...newClub, name: e.target.value})} />
                <GlowInput label="Description" placeholder="Brief description..." value={newClub.description} onChange={(e) => setNewClub({...newClub, description: e.target.value})} />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <select 
                    value={newClub.category} 
                    onChange={(e) => setNewClub({...newClub, category: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border text-foreground focus:outline-none focus:border-neon-cyan"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Arts">Arts</option>
                    <option value="Literary">Literary</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <GlowInput label="President Name" placeholder="Student President" value={newClub.president} onChange={(e) => setNewClub({...newClub, president: e.target.value})} />
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleAddClub} disabled={processing}>{processing ? "Creating..." : "Add Club"}</GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowAddModal(false)}>Cancel</GlowButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Club Modal */}
      <AnimatePresence>
        {showManageModal && selectedClub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowManageModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md glass rounded-2xl neon-border overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-neon-cyan" />
                  <h2 className="text-xl font-bold font-orbitron text-foreground">Manage Club</h2>
                </div>
                <X className="w-5 h-5 cursor-pointer text-muted-foreground" onClick={() => setShowManageModal(false)} />
              </div>
              <div className="p-6 space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground">{selectedClub.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedClub.category}</p>
                  <StatusBadge status={selectedClub.status} className="mt-2" />
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-sm font-medium text-foreground mb-3">Member Count</p>
                    <div className="flex items-center justify-center gap-4">
                      <GlowButton variant="pink" size="sm" onClick={() => updateClubMembers(-1)} disabled={processing}>-</GlowButton>
                      <span className="text-2xl font-bold font-orbitron text-neon-cyan">{selectedClub.members}</span>
                      <GlowButton variant="green" size="sm" onClick={() => updateClubMembers(1)} disabled={processing}>+</GlowButton>
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">Total Members (Atomic DB Update)</p>
                  </div>
                  <GlowButton 
                    variant={selectedClub.status === 'active' ? 'pink' : 'green'}
                    className="w-full"
                    onClick={toggleClubStatus}
                    disabled={processing}
                  >
                    {processing ? "Syncing..." : (selectedClub.status === 'active' ? 'Deactivate Club' : 'Activate Club')}
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