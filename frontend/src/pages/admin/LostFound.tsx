import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, Calendar, X, Check, Loader2 } from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { StatusBadge } from '@/components/ui/StatusBadge';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://smart-campus-backend-app.onrender.com/api';

export function LostFoundPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'lost' | 'found' | 'claimed'>('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [processing, setProcessing] = useState(false);

  const [newItem, setNewItem] = useState({
    itemName: '',
    description: '',
    category: 'Electronics',
    location: '',
    status: 'Lost',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const res = await axios.get(`${API_URL}/admin/lost-found`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        // 🔥 Normalize data to avoid null crashes
        const safeItems = (res.data.items || []).map((item: any) => ({
          ...item,
          itemName: item?.itemName || '',
          description: item?.description || '',
          category: item?.category || 'Accessories',
          location: item?.location || 'N/A',
          status: item?.status || 'Lost',
        }));

        setItems(safeItems);
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to load items", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const itemName = (item?.itemName || '').toLowerCase();
    const status = (item?.status || '').toLowerCase();
    const search = searchQuery.toLowerCase();

    const matchesSearch = itemName.includes(search);
    const matchesFilter = filter === 'all' || status === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const handleReportItem = async () => {
    if (!newItem.itemName.trim() || !newItem.location.trim()) {
      return toast({
        title: "Missing Info",
        description: "Please fill required fields",
        variant: "destructive"
      });
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        `${API_URL}/admin/lost-found`,
        newItem,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast({ title: "Success", description: "Item reported to database" });

        await fetchItems();
        setShowReportModal(false);

        setNewItem({
          itemName: '',
          description: '',
          category: 'Electronics',
          location: '',
          status: 'Lost'
        });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to save item", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const markAsClaimed = async (id: number) => {
    setProcessing(true);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.patch(
        `${API_URL}/admin/lost-found/${id}/status`,
        { status: 'Claimed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast({ title: "Item Claimed", description: "Database status: Claimed" });

        await fetchItems();
        setShowDetailModal(false);
      }
    } catch (err) {
      toast({ title: "Update Failed", description: "Could not update status", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const getItemEmoji = (category: string) => {
    switch (category) {
      case 'Electronics': return '💻';
      case 'Documents': return '🪪';
      case 'Books': return '📚';
      default: return '📦';
    }
  };

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-neon-cyan" />
      </div>
    );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Lost & Found</h1>
          <p className="text-muted-foreground mt-1">Live Database Tracking</p>
        </div>

        <GlowButton
          variant="gradient"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowReportModal(true)}
        >
          Report Item
        </GlowButton>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'lost', 'found', 'claimed'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filter === s ? 'bg-neon-cyan text-background glow-cyan' : 'bg-muted/50 text-muted-foreground'}`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item, i) => {
          const status = (item?.status || '').toLowerCase();

          return (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <NeonCard glowColor={status === 'lost' ? 'pink' : status === 'found' ? 'green' : 'cyan'}>
                <div className="space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{getItemEmoji(item.category)}</span>
                    <div className="z-10 bg-black/60 rounded-full px-2 py-1 shadow-[0_0_10px_rgba(0,0,0,0.5)]">
                      <StatusBadge status={item.status} />
                    </div>
                  </div>

                  <div className="text-left">
                    <h3 className="font-bold text-white mb-1">{item.itemName}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                  </div>

                  <GlowButton
                    variant="cyan"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDetailModal(true);
                    }}
                  >
                    View Details
                  </GlowButton>
                </div>
              </NeonCard>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md glass rounded-2xl neon-border overflow-hidden">

              <div className="p-6 space-y-6 text-left">
                <GlowButton
                  variant="green"
                  className="w-full"
                  icon={<Check className="w-4 h-4" />}
                  disabled={processing || (selectedItem?.status || '').toLowerCase() === 'claimed'}
                  onClick={() => markAsClaimed(selectedItem.id)}
                >
                  {(selectedItem?.status || '').toLowerCase() === 'claimed'
                    ? "Already Claimed"
                    : (processing ? "Updating..." : "Mark as Claimed")}
                </GlowButton>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Report Modal unchanged except safe logic */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowReportModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md glass rounded-2xl neon-border-purple overflow-hidden">

              <div className="p-6 space-y-4 text-left">
                <GlowInput label="Item Name" value={newItem.itemName} onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })} />
                <GlowInput label="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
                <GlowInput label="Location" value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} />

                <div className="flex gap-3 pt-4">
                  <GlowButton variant="gradient" className="flex-1" onClick={handleReportItem} disabled={processing}>
                    Submit Report
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowReportModal(false)}>
                    Cancel
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
