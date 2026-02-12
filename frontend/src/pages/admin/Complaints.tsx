import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, UserPlus, X, ChevronRight
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
        axios.get(`${API_URL}/admin/complaints`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/admin/faculty`, {
          headers: { Authorization: `Bearer ${token}` }
        })
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
          internalNotes:
            payload.internal_notes !== undefined
              ? payload.internal_notes
              : prev.internalNotes,
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

    const matchesStatus =
      statusFilter === 'all' || c?.status === statusFilter;

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

      {/* FILTER BUTTONS */}
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

      {/* LIST */}
      <div className="space-y-4">
        {filteredComplaints.map((c, i) => {
          const safeStatus = c?.status || 'Pending';
          const safePriority = c?.priority
            ? c.priority.toLowerCase()
            : 'medium';

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
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-4">
                    <NeonAvatar
                      initials={c?.studentName?.charAt(0) || 'S'}
                    />
                    <div>
                      <div className="flex gap-2">
                        <span className="text-xs text-neon-cyan font-mono">
                          {c?.customId || 'N/A'}
                        </span>
                        <PriorityChip priority={safePriority} />
                      </div>
                      <h3 className="font-semibold">
                        {c?.title || 'Untitled'}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={safeStatus} />
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </NeonCard>
            </motion.div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {showDetailModal && selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <motion.div className="bg-slate-900 p-6 rounded-2xl w-full max-w-3xl space-y-6">

              <div className="flex justify-between">
                <h2 className="text-xl font-bold">
                  {selectedComplaint?.title}
                </h2>
                <X onClick={() => setShowDetailModal(false)} />
              </div>

              {/* STATUS DROPDOWN */}
              <select
                value={selectedComplaint?.status || 'Pending'}
                onChange={(e) =>
                  handleUpdate(selectedComplaint.id, {
                    status: e.target.value
                  })
                }
                className="bg-black border border-white/10 rounded p-2"
              >
                <option value="Pending">Pending</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
                <option value="Closed">Closed</option>
              </select>

              {/* ASSIGN BUTTON */}
              <GlowButton
                variant="purple"
                icon={<UserPlus className="w-4 h-4" />}
                onClick={() => setShowAssignModal(true)}
              >
                Assign Faculty
              </GlowButton>

              {/* SAVE NOTE */}
              <GlowButton
                variant="cyan"
                onClick={() =>
                  handleUpdate(selectedComplaint.id, {
                    internal_notes: adminNote
                  })
                }
              >
                Save Note
              </GlowButton>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ASSIGN MODAL */}
      <AnimatePresence>
        {showAssignModal && selectedComplaint && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <motion.div className="bg-slate-900 p-6 rounded-2xl w-full max-w-md space-y-4">
              <h2 className="text-lg font-bold">Assign Faculty</h2>

              {facultyList.map(f => (
                <button
                  key={f.id}
                  onClick={() =>
                    handleUpdate(selectedComplaint.id, {
                      assigned_to: f.id,
                      status: 'In-Progress'
                    })
                  }
                  className="w-full text-left p-3 border border-white/10 rounded hover:bg-white/5"
                >
                  {f.name}
                </button>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
