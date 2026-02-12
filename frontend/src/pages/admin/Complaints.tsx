import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Eye, UserPlus, X, Send, ChevronRight
} from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityChip } from '@/components/ui/PriorityChip';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://smart-campus-backend-app.onrender.com/api';

export function ComplaintsPage() {
  const [complaintList, setComplaintList] = useState<any[]>([]);
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [compRes, facRes] = await Promise.all([
        axios.get(`${API_URL}/admin/complaints`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/faculty`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setComplaintList(Array.isArray(compRes?.data?.data) ? compRes.data.data : []);
      setFacultyList(Array.isArray(facRes?.data?.data) ? facRes.data.data : []);
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number, payload: any) => {
    if (processing) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_URL}/admin/complaints/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await fetchData();

      if (selectedComplaint && selectedComplaint.id === id) {
        setSelectedComplaint((prev: any) => ({
          ...prev,
          ...payload,
          internalNotes: payload.internal_notes !== undefined ? payload.internal_notes : prev.internalNotes,
          status: payload.status || prev.status || 'Pending'
        }));
      }

      if (payload.assigned_to) setShowAssignModal(false);
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const filteredComplaints = complaintList.filter((c) => {
    const matchesSearch =
      (c?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c?.studentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c?.customId || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading)
    return (
      <div className="p-10 text-center font-orbitron text-neon-cyan animate-pulse">
        Syncing Database...
      </div>
    );

  return (
    <div className="space-y-6 text-white">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Complaint Management</h1>
          <p className="text-muted-foreground mt-1">Command Center</p>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-2">
        {['all', 'Pending', 'In-Progress', 'Resolved'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              statusFilter === s
                ? 'bg-neon-cyan text-black glow-cyan'
                : 'bg-muted/50 text-white'
            }`}
          >
            {s.toUpperCase()} (
            {s === 'all'
              ? complaintList.length
              : complaintList.filter(c => c?.status === s).length}
            )
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredComplaints.map((c, i) => {
          const safeStatus = c?.status || 'Pending';
          const safePriority = c?.priority ? c.priority.toLowerCase() : 'medium';

          return (
            <motion.div
              key={c?.id || i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <NeonCard
                glowColor={safeStatus === 'Escalated' ? 'pink' : 'cyan'}
                className="cursor-pointer"
                onClick={() => {
                  setSelectedComplaint(c);
                  setAdminNote(c?.internalNotes || '');
                  setShowDetailModal(true);
                }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 p-2">
                  <div className="flex items-center gap-4 flex-1">
                    <NeonAvatar
                      initials={c?.studentName?.charAt(0) || 'S'}
                      glowColor={safeStatus === 'Escalated' ? 'pink' : 'cyan'}
                    />
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <span className="text-xs text-neon-cyan font-mono">
                          {c?.customId || 'N/A'}
                        </span>
                        <PriorityChip priority={safePriority} />
                      </div>
                      <h3 className="font-semibold text-white mt-1">
                        {c?.title || 'Untitled Complaint'}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <StatusBadge status={safeStatus} />
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          );
        })}
      </div>

      {/* MODALS REMAIN SAME (safe due to default values above) */}
      <AnimatePresence>
        {showDetailModal && selectedComplaint && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl glass rounded-2xl neon-border overflow-hidden p-6 space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between border-b border-border/50 pb-4">
                <h2 className="text-xl font-bold font-orbitron text-white">
                  {selectedComplaint?.title || 'Complaint'}
                </h2>
                <X className="cursor-pointer text-white" onClick={() => setShowDetailModal(false)} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-white">
                <div>
                  <p className="text-muted-foreground uppercase text-[10px]">Student</p>
                  {selectedComplaint?.studentName || 'Unknown'}
                </div>
                <div>
                  <p className="text-muted-foreground uppercase text-[10px]">Category</p>
                  {selectedComplaint?.category || 'N/A'}
                </div>
                <div>
                  <p className="text-muted-foreground uppercase text-[10px]">Assigned</p>
                  {selectedComplaint?.facultyName || 'Unassigned'}
                </div>
                <div>
                  <StatusBadge status={selectedComplaint?.status || 'Pending'} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
