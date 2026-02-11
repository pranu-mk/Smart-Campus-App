import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Calendar, MapPin, Users, Edit, Trash2, X, Loader2 } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { GlowInput } from '@/components/ui/GlowInput';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function EventsPage() {
  const [eventList, setEventList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [editingEvent, setEditingEvent] = useState<any>({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/admin/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setEventList(res.data.events);
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not sync with database.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    if (!editingEvent.title || !editingEvent.date) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/events`, editingEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Success", description: "Event published." });
      fetchEvents();
      setShowAddModal(false);
      setEditingEvent({});
    } catch (err) {
      toast({ title: "Error", description: "Failed to create event", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setEditingEvent({ ...event });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedEvent) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/events/${selectedEvent.id}`, editingEvent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Updated", description: "Changes reflected across all dashboards." });
      fetchEvents();
      setShowEditModal(false);
    } catch (err) {
      toast({ title: "Update Failed", description: "Database error.", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Remove this event globally?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Deleted", description: "Event removed." });
      fetchEvents();
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  };

  const filteredEvents = eventList.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGlowColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming': return 'cyan';
      case 'ongoing': return 'purple';
      case 'completed': return 'green';
      default: return 'pink';
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-neon-cyan" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Events Management</h1>
          <p className="text-muted-foreground mt-1">Single Source of Truth active.</p>
        </div>
        <GlowButton variant="gradient" icon={<Plus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>Create Event</GlowButton>
      </motion.div>

      <NeonCard glowColor="purple" hover={false}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text" placeholder="Search events..." value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-neon-purple"
          />
        </div>
      </NeonCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, i) => (
          <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <NeonCard glowColor={getGlowColor(event.status)}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <StatusBadge status={event.status} />
                  <span className="text-xs text-neon-cyan font-mono bg-neon-cyan/10 px-2 py-1 rounded uppercase tracking-wider">{event.category}</span>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-foreground">{event.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
                </div>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-neon-purple" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-neon-pink" />
                    <span>{event.venue}</span>
                  </div>
                
                </div>
                <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(event.registrations / (event.maxCapacity || 100)) * 100}%` }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full"
                  />
                </div>
                <div className="flex gap-2">
                  <GlowButton variant="cyan" size="sm" className="flex-1" onClick={() => handleEditEvent(event)}><Edit className="w-4 h-4" /> Edit</GlowButton>
                  <GlowButton variant="pink" size="sm" onClick={() => handleDeleteEvent(event.id)}><Trash2 className="w-4 h-4" /></GlowButton>
                </div>
              </div>
            </NeonCard>
          </motion.div>
        ))}
      </div>

      {/* Edit Event Modal */}
      <AnimatePresence>
        {showEditModal && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Edit Event</h2>
                <X className="w-5 h-5 cursor-pointer text-muted-foreground" onClick={() => setShowEditModal(false)} />
              </div>
              <div className="p-6 space-y-4 text-left">
                <GlowInput label="Event Title" value={editingEvent.title || ''} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} />
                <GlowInput label="Description" value={editingEvent.description || ''} onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <GlowInput label="Date" type="date" value={editingEvent.date || ''} onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})} />
                  <GlowInput label="Time" type="time" value={editingEvent.time || ''} onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})} />
                </div>
                <GlowInput label="Venue" value={editingEvent.venue || ''} onChange={(e) => setEditingEvent({...editingEvent, venue: e.target.value})} />
               
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <select 
                    value={editingEvent.status || 'Upcoming'} 
                    onChange={(e) => setEditingEvent({...editingEvent, status: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-[#0a0a1a] border border-border text-foreground outline-none"
                  >
                    <option value="Upcoming">Upcoming</option><option value="Ongoing">Ongoing</option><option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleSaveEdit} disabled={processing}>Save Changes</GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowEditModal(false)}>Cancel</GlowButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Event Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass rounded-2xl neon-border-purple overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Create Event</h2>
                <X className="w-5 h-5 cursor-pointer text-muted-foreground" onClick={() => setShowAddModal(false)} />
              </div>
              <div className="p-6 space-y-4 text-left">
                <GlowInput label="Event Title" value={editingEvent.title || ''} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} />
                <GlowInput label="Description" value={editingEvent.description || ''} onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <GlowInput label="Date" type="date" value={editingEvent.date || ''} onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})} />
                  <GlowInput label="Time" type="time" value={editingEvent.time || ''} onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})} />
                </div>
                <GlowInput label="Venue" value={editingEvent.venue || ''} onChange={(e) => setEditingEvent({...editingEvent, venue: e.target.value})} />
                <GlowInput label="Max Capacity" type="number" value={String(editingEvent.maxCapacity || '')} onChange={(e) => setEditingEvent({...editingEvent, maxCapacity: e.target.value})} />
                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleAddEvent} disabled={processing}>Create Event</GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowAddModal(false)}>Cancel</GlowButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}