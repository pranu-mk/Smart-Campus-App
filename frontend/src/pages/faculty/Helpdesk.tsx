import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  MessageSquare,
  Clock,
  Send,
  Loader2,
  LifeBuoy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

/* ---------------- SAFE COLOR MAPS ---------------- */

const statusColors: any = {
  Open: { bg: "#FFFBEB", text: "#D97706", border: "#FCD34D" },
  "In Progress": { bg: "#EFF6FF", text: "#2563EB", border: "#93C5FD" },
  Resolved: { bg: "#ECFDF5", text: "#059669", border: "#6EE7B7" },
  Closed: { bg: "#F3F4F6", text: "#6B7280", border: "#D1D5DB" },
};

const priorityColors: any = {
  Low: { bg: "#ECFDF5", text: "#059669", border: "#6EE7B7" },
  Medium: { bg: "#FFFBEB", text: "#D97706", border: "#FCD34D" },
  High: { bg: "#FEF2F2", text: "#DC2626", border: "#FCA5A5" },
};

/* ---------------- COMPONENT ---------------- */

const Helpdesk = ({ theme = "dark" }: { theme?: string }) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [replyTicket, setReplyTicket] = useState<any | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [newTicket, setNewTicket] = useState({
    issueType: "",
    priority: "Medium",
    subject: "",
    description: "",
  });

  const { toast } = useToast();

  const isDark = theme === "dark";
  const cardBg = isDark
    ? "bg-gray-800 border-gray-700"
    : "bg-white border-gray-200";

  const textPrimary = isDark ? "text-gray-100" : "text-gray-800";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const inputClass = isDark
    ? "bg-gray-700 border-gray-600 text-gray-100"
    : "bg-gray-50 border-gray-200";

  /* ---------------- FETCH ---------------- */

  const fetchTickets = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "https://smart-campus-backend-app.onrender.com/api/faculty/helpdesk/tickets",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setTickets(res.data.data || []);
        setStats({
          total: res.data.stats?.total || 0,
          open: res.data.stats?.open || 0,
          inProgress: res.data.stats?.inProgress || 0,
          resolved: res.data.stats?.resolved || 0,
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load tickets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  /* ---------------- SAFE FILTER ---------------- */

  const filteredTickets = tickets.filter((t) =>
    (t.subject || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (t.id || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- SAFE STYLE GETTERS ---------------- */

  const getStatusStyle = (status: string) =>
    statusColors[status] || {
      bg: "#F3F4F6",
      text: "#6B7280",
      border: "#D1D5DB",
    };

  const getPriorityStyle = (priority: string) =>
    priorityColors[priority] || {
      bg: "#F3F4F6",
      text: "#6B7280",
      border: "#D1D5DB",
    };

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${textPrimary}`}>
            Helpdesk Support
          </h1>
          <p className={textSecondary}>
            Track and manage your technical queries
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Total", count: stats.total, icon: LifeBuoy },
          { label: "Open", count: stats.open, icon: AlertCircle },
          { label: "In Progress", count: stats.inProgress, icon: Clock },
          { label: "Resolved", count: stats.resolved, icon: CheckCircle2 },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border shadow-sm flex items-center gap-4"
          >
            <stat.icon className="w-6 h-6 text-blue-500" />
            <div>
              <p className="text-xl font-bold">{stat.count}</p>
              <p className="text-xs text-gray-500 uppercase">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Tickets */}
      <div className="space-y-4">
        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No tickets found.
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const statusStyle = getStatusStyle(ticket.status);
            const priorityStyle = getPriorityStyle(ticket.priority);

            return (
              <div
                key={ticket.id}
                className={`rounded-xl shadow-sm p-5 ${cardBg}`}
              >
                <div className="flex justify-between">
                  <div>
                    <span className="text-sm font-mono text-blue-500">
                      {ticket.id}
                    </span>

                    <div className="flex gap-2 mt-2">
                      <Badge
                        style={{
                          backgroundColor: priorityStyle.bg,
                          color: priorityStyle.text,
                          borderColor: priorityStyle.border,
                        }}
                      >
                        {ticket.priority}
                      </Badge>

                      <Badge
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          borderColor: statusStyle.border,
                        }}
                      >
                        {ticket.status}
                      </Badge>
                    </div>

                    <h3 className={`mt-2 ${textPrimary}`}>
                      {ticket.subject}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reply Modal */}
      <Dialog open={!!replyTicket} onOpenChange={() => setReplyTicket(null)}>
        <DialogContent className={`max-w-xl ${cardBg}`}>
          <DialogHeader>
            <DialogTitle className={textPrimary}>
              Conversation - {replyTicket?.id}
            </DialogTitle>
            <DialogDescription>
              Discussion history and reply section.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Helpdesk;
