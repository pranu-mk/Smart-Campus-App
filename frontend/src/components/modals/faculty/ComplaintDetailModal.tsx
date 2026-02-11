import { useState, useEffect } from "react";
import { User, Building, Mail, Phone, FileText, Image, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// FIXED INTERFACE: Synchronized with backend SQL aliases and flexible types
export interface Complaint {
  id: string;
  studentName: string;
  department: string;
  type: string;
  priority: string;
  date: string;
  status: string;
  description?: string;
  facultyResponse?: string; // Maps from DB faculty_reply
  internalNote?: string;    // Maps from DB internal_notes
}

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { status: string; response: string; note: string }) => void;
}

// DEFENSIVE COLORS: Added fallbacks for Critical and unknown types
const priorityColors: any = {
  Low: { bg: "#052E16", text: "#22C55E", border: "#16A34A" },
  Medium: { bg: "#3B2F0B", text: "#F59E0B", border: "#D97706" },
  High: { bg: "#3F0D0D", text: "#EF4444", border: "#DC2626" },
  Critical: { bg: "#450A0A", text: "#F87171", border: "#991B1B" },
  unknown: { bg: "#1F2937", text: "#9CA3AF", border: "#374151" }
};

const ComplaintDetailModal = ({ complaint, isOpen, onClose, onSubmit }: ComplaintDetailModalProps) => {
  const [status, setStatus] = useState<string>("Pending");
  const [facultyResponse, setFacultyResponse] = useState("");
  const [internalNote, setInternalNote] = useState("");

  // Sync internal state when a new complaint is opened to ensure data persistence
  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || "Pending");
      setFacultyResponse(complaint.facultyResponse || "");
      setInternalNote(complaint.internalNote || "");
    }
  }, [complaint, isOpen]);

  if (!complaint) return null;

  const handleSubmit = () => {
    // Pass the captured state back to the parent component handleActionSubmit
    onSubmit({
      status,
      response: facultyResponse,
      note: internalNote
    });
    // Modal closure handled by parent after successful API response is best, 
    // but keeping onClose here for immediate UI feedback.
  };

  const pStyle = priorityColors[complaint.priority] || priorityColors.unknown;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <DialogTitle className="text-xl font-bold text-gray-800">
              Complaint {complaint.id}
            </DialogTitle>
            <Badge 
              variant="outline" 
              style={{
                backgroundColor: pStyle.bg,
                color: pStyle.text,
                borderColor: pStyle.border,
              }}
            >
              {complaint.priority} Priority
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 max-h-[calc(90vh-120px)] overflow-auto">
          {/* Left Panel - Student Info */}
          <div className="p-6 border-r border-gray-200 space-y-6 text-left">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Student Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100"><User className="w-4 h-4 text-blue-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Student Name</p>
                  <p className="font-medium text-gray-800">{complaint.studentName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-100"><Building className="w-4 h-4 text-cyan-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium text-gray-800">{complaint.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100"><Mail className="w-4 h-4 text-green-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">Verified via System</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Complaint Details */}
          <div className="p-6 border-r border-gray-200 space-y-6 text-left">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Complaint Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Type</p>
                <p className="font-medium text-gray-800">{complaint.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date Submitted</p>
                <p className="font-medium text-gray-800">{complaint.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <div className="p-4 rounded-lg bg-gray-50 text-sm text-gray-700 leading-relaxed border italic">
                  "{complaint.description || 'No description provided.'}"
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Action Panel */}
          <div className="p-6 space-y-6 text-left">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Action Panel</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Update Status</p>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="bg-gray-50 border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200">
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Faculty Response (Visible to Student)</p>
                <Textarea
                  placeholder="Enter your response to the student..."
                  value={facultyResponse}
                  onChange={(e) => setFacultyResponse(e.target.value)}
                  className="bg-gray-50 border-gray-200 min-h-[100px] resize-none"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Internal Note (Admin only)</p>
                <Textarea
                  placeholder="Add internal notes..."
                  value={internalNote}
                  onChange={(e) => setInternalNote(e.target.value)}
                  className="bg-gray-50 border-gray-200 min-h-[80px] resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 border-gray-200" onClick={onClose}>Cancel</Button>
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white" onClick={handleSubmit}>
                  <Send className="w-4 h-4 mr-2" /> Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComplaintDetailModal;