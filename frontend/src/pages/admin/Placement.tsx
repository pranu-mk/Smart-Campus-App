import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Building2, DollarSign, Calendar, Users, Award, X, Edit, Eye, Loader2 } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function PlacementPage() {
  const [drives, setDrives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState<any | null>(null);
  const [newDrive, setNewDrive] = useState({
    company: '',
    role: '',
    package: '',
    eligibility: '',
    driveDate: '',
    registrationDeadline: '',
  });

  // --- 1. FETCH LIVE PLACEMENT DATA ---
  const fetchDrives = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/placements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setDrives(res.data.drives);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load placement drives.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const filteredDrives = drives.filter(
    (d) =>
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- 2. PERSIST NEW DRIVE TO DB ---
  const handleAddDrive = async () => {
    if (!newDrive.company || !newDrive.role) return;
    
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/placements`, newDrive, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Drive Added", description: `${newDrive.company} drive is live.` });
      await fetchDrives();
      setShowAddModal(false);
      setNewDrive({ company: '', role: '', package: '', eligibility: '', driveDate: '', registrationDeadline: '' });
    } catch (err) {
      toast({ title: "Error", description: "Could not save drive.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleViewDetails = (drive: any) => {
    setSelectedDrive(drive);
    setShowDetailModal(true);
  };

  const handleEditDrive = (drive: any) => {
    setSelectedDrive(drive);
    setNewDrive({
      company: drive.company,
      role: drive.role,
      package: drive.package,
      eligibility: drive.eligibility,
      driveDate: drive.driveDate,
      registrationDeadline: drive.registrationDeadline,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedDrive) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/placements/${selectedDrive.id}`, newDrive, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Updated", description: "Drive details updated successfully." });
      await fetchDrives();
      setShowEditModal(false);
    } catch (err) {
      toast({ title: "Update Failed", description: "Database sync error.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  // --- 3. DYNAMIC STATUS UPDATE ---
  const updateDriveStatus = async (status: string) => {
    if (!selectedDrive) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_URL}/admin/placements/${selectedDrive.id}/status`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast({ title: "Status Synced", description: `Drive is now ${status}.` });
        setSelectedDrive({ ...selectedDrive, status });
        setDrives(prev => prev.map(d => d.id === selectedDrive.id ? { ...d, status } : d));
      }
    } catch (err) {
      toast({ title: "Error", description: "Status update failed.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-neon-cyan" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Placement Drives</h1>
          <p className="text-muted-foreground mt-1">Manage campus recruitment activities</p>
        </div>
        <GlowButton variant="gradient" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>Add Drive</GlowButton>
      </motion.div>

      {/* Stats Table - Dynamic */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NeonCard glowColor="cyan" className="text-center py-4">
          <p className="text-3xl font-bold font-orbitron text-neon-cyan">{drives.length}</p>
          <p className="text-sm text-muted-foreground">Total Drives</p>
        </NeonCard>
        <NeonCard glowColor="purple" className="text-center py-4">
          <p className="text-3xl font-bold font-orbitron text-neon-purple">{drives.reduce((a, b) => a + (b.registrations || 0), 0)}</p>
          <p className="text-sm text-muted-foreground">Registrations</p>
        </NeonCard>
        <NeonCard glowColor="green" className="text-center py-4">
          <p className="text-3xl font-bold font-orbitron text-neon-green">{drives.reduce((a, b) => a + (b.selected || 0), 0)}</p>
          <p className="text-sm text-muted-foreground">Selected</p>
        </NeonCard>
        <NeonCard glowColor="pink" className="text-center py-4">
          <p className="text-3xl font-bold font-orbitron text-neon-pink">{drives.filter(d => d.status === 'Upcoming').length}</p>
          <p className="text-sm text-muted-foreground">Upcoming</p>
        </NeonCard>
      </div>

      <NeonCard glowColor="purple" hover={false}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text" placeholder="Search companies or roles..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none"
          />
        </div>
      </NeonCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDrives.map((drive, i) => (
          <motion.div key={drive.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <NeonCard glowColor={drive.status === 'Upcoming' ? 'cyan' : drive.status === 'Ongoing' ? 'purple' : 'green'}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-foreground">{drive.company}</h3>
                      <p className="text-sm text-neon-purple">{drive.role}</p>
                    </div>
                  </div>
                  <StatusBadge status={drive.status} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-neon-green" />
                    <span className="text-sm text-foreground">{drive.package}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neon-pink" />
                    <span className="text-sm text-foreground">{drive.driveDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neon-cyan" />
                    <span className="text-sm text-foreground">{drive.registrations || 0} registered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-neon-purple" />
                    <span className="text-sm text-foreground">{drive.selected || 0} selected</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-left">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Eligibility</p>
                  <p className="text-sm text-foreground">{drive.eligibility}</p>
                </div>

                <div className="flex gap-2">
                  <GlowButton variant="cyan" size="sm" className="flex-1" onClick={() => handleViewDetails(drive)}><Eye className="w-4 h-4" /> View Details</GlowButton>
                  <GlowButton variant="purple" size="sm" onClick={() => handleEditDrive(drive)}><Edit className="w-4 h-4" /> Edit</GlowButton>
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailModal && selectedDrive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Drive Details</h2>
                <X className="w-5 h-5 cursor-pointer text-muted-foreground" onClick={() => setShowDetailModal(false)} />
              </div>
              <div className="p-6 space-y-6 text-left">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center"><Building2 className="w-8 h-8 text-neon-cyan" /></div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{selectedDrive.company}</h3>
                    <p className="text-sm text-neon-purple">{selectedDrive.role}</p>
                    <StatusBadge status={selectedDrive.status} className="mt-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                    <p className="text-2xl font-bold font-orbitron text-neon-green">{selectedDrive.package}</p>
                    <p className="text-xs text-muted-foreground">Package</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/50 text-center">
                    <p className="text-2xl font-bold font-orbitron text-neon-cyan">{selectedDrive.registrations || 0}</p>
                    <p className="text-xs text-muted-foreground">Registrations</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Eligibility</p>
                  <p className="text-sm text-foreground">{selectedDrive.eligibility}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Drive Date</p><p className="text-sm text-foreground">{selectedDrive.driveDate}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase tracking-wider">Deadline</p><p className="text-sm text-foreground">{selectedDrive.registrationDeadline}</p></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Update Status (Database Sync)</label>
                  <div className="flex gap-2">
                    <GlowButton variant={selectedDrive.status === 'Upcoming' ? 'cyan' : 'purple'} size="sm" onClick={() => updateDriveStatus('Upcoming')} disabled={processing}>Upcoming</GlowButton>
                    <GlowButton variant={selectedDrive.status === 'Ongoing' ? 'cyan' : 'purple'} size="sm" onClick={() => updateDriveStatus('Ongoing')} disabled={processing}>Ongoing</GlowButton>
                    <GlowButton variant={selectedDrive.status === 'Completed' ? 'cyan' : 'purple'} size="sm" onClick={() => updateDriveStatus('Completed')} disabled={processing}>Completed</GlowButton>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Drive Modal - Fixed Integration */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass rounded-2xl neon-border-purple overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground text-left">Add Placement Drive</h2>
                <X className="w-5 h-5 cursor-pointer text-muted-foreground" onClick={() => setShowAddModal(false)} />
              </div>
              <div className="p-6 space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <GlowInput label="Company" value={newDrive.company} onChange={(e) => setNewDrive({...newDrive, company: e.target.value})} />
                  <GlowInput label="Role" value={newDrive.role} onChange={(e) => setNewDrive({...newDrive, role: e.target.value})} />
                </div>
                <GlowInput label="Package" value={newDrive.package} onChange={(e) => setNewDrive({...newDrive, package: e.target.value})} />
                <GlowInput label="Eligibility" value={newDrive.eligibility} onChange={(e) => setNewDrive({...newDrive, eligibility: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <GlowInput label="Drive Date" type="date" value={newDrive.driveDate} onChange={(e) => setNewDrive({...newDrive, driveDate: e.target.value})} />
                  <GlowInput label="Deadline" type="date" value={newDrive.registrationDeadline} onChange={(e) => setNewDrive({...newDrive, registrationDeadline: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleAddDrive} disabled={processing}>{processing ? "Saving..." : "Add Drive"}</GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowAddModal(false)}>Cancel</GlowButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal remains similar with handleSaveEdit logic */}
    </div>
  );
}