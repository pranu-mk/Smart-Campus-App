import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mail,
  Phone,
  Eye,
  X,
  AlertTriangle,
} from 'lucide-react';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { NeonTable } from '@/components/ui/NeonTable';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import { PriorityChip } from '@/components/ui/PriorityChip';
import { getStudents, getStudentComplaints } from '@/modules/admin/services/studentService';

export function StudentsPage() {
  const [studentList, setStudentList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showComplaintsModal, setShowComplaintsModal] = useState(false);
  const [studentComplaints, setStudentComplaints] = useState<any[]>([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await getStudents();
      if (res && res.success && Array.isArray(res.data)) {
        setStudentList(res.data);
      } else if (Array.isArray(res)) {
        setStudentList(res);
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = studentList.filter(
    (s) =>
      (s.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (s.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (s.enrollmentNo?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const viewStudent = (student: any) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const viewComplaints = async (student: any) => {
    setSelectedStudent(student);
    try {
      const res = await getStudentComplaints(student.id);
      if (res && res.success) {
        setStudentComplaints(res.data);
      } else if (Array.isArray(res)) {
        setStudentComplaints(res);
      }
      setShowComplaintsModal(true);
    } catch (err) {
      console.error("Failed to load complaints:", err);
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Student',
      render: (student: any) => (
        <div className="flex items-center gap-3">
          <NeonAvatar
            initials={student.name?.charAt(0) || 'S'}
            glowColor={student.status === 'active' ? 'cyan' : 'pink'}
            size="sm"
          />
          <div>
            <p className="font-medium text-white">{student.name}</p>
            <p className="text-xs text-white/60">{student.enrollmentNo || 'N/A'}</p>
          </div>
        </div>
      ),
    },
    // FIX: Added explicit render functions with text-white classes for visibility
    { 
      key: 'email', 
      header: 'Email',
      render: (student: any) => (
        <span className="text-white text-sm">{student.email}</span>
      )
    },
    { 
      key: 'department', 
      header: 'Department', 
      render: (student: any) => (
        <span className="text-white text-sm">{student.department || 'Unassigned'}</span>
      )
    },
    { 
      key: 'semester', 
      header: 'Year/Sem', 
      render: (student: any) => (
        <span className="text-white text-sm">{student.semester || 'N/A'}</span>
      )
    },
    {
      key: 'complaintsCount',
      header: 'Complaints',
      render: (s: any) => (
        <span className={(s.complaintsCount || 0) > 5 ? 'text-destructive font-bold' : 'text-white'}>
          {s.complaintsCount || 0}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (s: any) => <StatusBadge status={s.status || 'active'} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (student: any) => (
        <button
          onClick={(e) => { e.stopPropagation(); viewStudent(student); }}
          className="p-1.5 rounded-lg hover:bg-neon-cyan/10 text-white hover:text-neon-cyan transition-colors"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      <p className="font-orbitron text-neon-cyan animate-pulse">Accessing Student Directory...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Student Management</h1>
          <p className="text-muted-foreground mt-1">Manage {studentList.length} registered students</p>
        </div>
      </motion.div>

      <NeonCard glowColor="cyan" hover={false}>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students by name, email, or PRN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-all"
          />
        </div>
      </NeonCard>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: studentList.length, color: 'cyan' },
          { label: 'Active', value: studentList.filter((s) => (s.status || 'active') === 'active').length, color: 'green' },
          { label: 'Blocked', value: studentList.filter((s) => s.status === 'blocked').length, color: 'pink' },
          { label: 'Global Complaints', value: studentList.reduce((a, b) => a + (b.complaintsCount || 0), 0), color: 'purple' },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="p-4 rounded-xl glass border border-border/50 text-center">
            <p className={`text-2xl font-bold font-orbitron text-neon-${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="admin-students-table-scope">
        <NeonTable data={filteredStudents} columns={columns} onRowClick={viewStudent} />
      </div>

      <style>{`
        .admin-students-table-scope table thead th {
            color: #00f2ff !important;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
      `}</style>

      <AnimatePresence>
        {showModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass rounded-2xl neon-border overflow-hidden">
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-bold font-orbitron text-white">Student Profile</h2>
                <button onClick={() => setShowModal(false)} className="text-white/60 hover:text-white transition-colors"><X /></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <NeonAvatar initials={selectedStudent.name?.charAt(0)} glowColor="cyan" size="lg" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedStudent.name}</h3>
                    <p className="text-sm text-white/60">{selectedStudent.enrollmentNo || 'No PRN set'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-white/40">Email</p><p className="truncate text-white">{selectedStudent.email}</p></div>
                  <div><p className="text-white/40">Phone</p><p className="text-white">{selectedStudent.phone || 'N/A'}</p></div>
                  <div><p className="text-white/40">Dept</p><p className="text-white">{selectedStudent.department || 'N/A'}</p></div>
                  <div><p className="text-white/40">Year</p><p className="text-white">{selectedStudent.semester || 'N/A'}</p></div>
                </div>
                <GlowButton variant="cyan" fullWidth onClick={() => { setShowModal(false); viewComplaints(selectedStudent); }}>
                  View History
                </GlowButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showComplaintsModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setShowComplaintsModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl glass rounded-2xl neon-border overflow-hidden">
              <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <h2 className="text-xl font-bold font-orbitron text-white">Complaint History: {selectedStudent.name}</h2>
                <button onClick={() => setShowComplaintsModal(false)}><X /></button>
              </div>
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                {studentComplaints.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-white/40 italic">No complaints filed by this student.</p>
                  </div>
                ) : (
                  studentComplaints.map(c => (
                    <div key={c.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white">{c.title}</h4>
                          <p className="text-xs text-white/60 mt-1 line-clamp-2">{c.description}</p>
                        </div>
                        <StatusBadge status={c.status} />
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10">
                         <PriorityChip priority={c.priority?.toLowerCase() || 'medium'} />
                         <p className="text-[10px] text-white/40">{new Date(c.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}