import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  GraduationCap,
  MessageSquareWarning,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { NeonCard } from '@/components/ui/NeonCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityChip } from '@/components/ui/PriorityChip';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import { fetchDashboardSummary } from '@/modules/admin/services/services';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#00f2ff', '#bd00ff', '#ff00d4', '#00ff88', '#ffb800', '#ff4d4d'];

export function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchDashboardSummary();
        if (result && result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
        <p className="font-orbitron text-neon-cyan animate-pulse">Initializing Command Center...</p>
      </div>
    );
  }

  if (!data || !data.stats) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-orbitron text-foreground">Data Sync Failed</h2>
        <p className="text-muted-foreground mt-2">Could not connect to Command Center services.</p>
      </div>
    );
  }

  const { stats, charts, activity } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora">Command Center</h1>
          <p className="text-muted-foreground mt-1">Real-time campus monitoring active.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="w-4 h-4 text-neon-green animate-pulse" />
          <span>System Online</span>
          <span className="text-border">|</span>
          <span>{new Date(data.serverTime).toLocaleDateString()}</span>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={stats.totalStudents || 0} icon={GraduationCap} glowColor="cyan" delay={0} />
        <StatsCard title="Faculty Members" value={stats.totalFaculty || 0} icon={Users} glowColor="purple" delay={0.1} />
        <StatsCard title="Total Complaints" value={stats.totalComplaints || 0} icon={MessageSquareWarning} glowColor="pink" delay={0.2} />
        <StatsCard title="Resolution Rate" value={`${stats.resolutionRate || 0}%`} icon={CheckCircle2} glowColor="green" delay={0.3} />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NeonCard glowColor="cyan" className="text-center py-4">
          <div className="text-neon-yellow text-2xl font-bold font-orbitron">{stats.pending || 0}</div>
          <p className="text-xs text-muted-foreground">Pending</p>
        </NeonCard>
        <NeonCard glowColor="purple" className="text-center py-4">
          <div className="text-neon-green text-2xl font-bold font-orbitron">{stats.resolved || 0}</div>
          <p className="text-xs text-muted-foreground">Resolved</p>
        </NeonCard>
        <NeonCard glowColor="pink" className="text-center py-4">
          <div className="text-destructive text-2xl font-bold font-orbitron">{stats.escalated || 0}</div>
          <p className="text-xs text-muted-foreground">Closed</p>
        </NeonCard>
        <NeonCard glowColor="green" className="text-center py-4">
          <TrendingUp className="w-5 h-5 mx-auto text-neon-cyan" />
          <p className="text-xs text-muted-foreground mt-1">Syncing</p>
        </NeonCard>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NeonCard glowColor="cyan" className="lg:col-span-2">
          <h3 className="text-sm font-orbitron mb-4">Complaint Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.trends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#888" fontSize={10} />
                <YAxis stroke="#888" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0a0a0c', border: '1px solid #00f2ff' }} />
                <Area type="monotone" dataKey="complaints" stroke="#ff00d4" fill="#ff00d4" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </NeonCard>

        <NeonCard glowColor="purple">
          <h3 className="text-sm font-orbitron mb-4">Categories</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.categories || []} innerRadius={60} outerRadius={80} dataKey="value">
                  {(charts.categories || []).map((_: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </NeonCard>
      </div>

      {/* Recent Complaints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <NeonCard glowColor="cyan" className="lg:col-span-2">
          <h3 className="text-sm font-orbitron mb-4">Recent Complaints</h3>
          <div className="space-y-3">
            {(activity.recentComplaints || []).map((complaint: any, i: number) => {
              // NORMALIZATION FIX: Ensure priority is lowercase for the PriorityChip
              const safePriority = (complaint.priority || 'medium').toLowerCase();
              return (
                <div key={complaint.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10">
                  <NeonAvatar initials={complaint.studentName?.charAt(0) || 'U'} glowColor={i % 2 === 0 ? 'cyan' : 'purple'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{complaint.title}</p>
                    <p className="text-xs text-muted-foreground">{complaint.studentName}</p>
                  </div>
                  <PriorityChip priority={safePriority} />
                  <StatusBadge status={complaint.status} />
                </div>
              );
            })}
          </div>
        </NeonCard>

        <NeonCard glowColor="purple">
          <h3 className="text-sm font-orbitron mb-4">Upcoming Events</h3>
          <div className="space-y-3">
            {(activity.upcomingEvents || []).map((event: any) => (
              <div key={event.id} className="p-2 rounded bg-white/5 border border-white/10 text-xs">
                <p className="font-medium">{event.title}</p>
                <p className="text-muted-foreground">{new Date(event.date).toLocaleDateString()} • {event.venue}</p>
              </div>
            ))}
          </div>
        </NeonCard>
      </div>
    </div>
  );
}