import { useState } from "react";
import { motion } from "framer-motion";
import { X, MessageSquare, Clock, CheckCircle, AlertCircle, Send, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";

interface Complaint {
  id: string;
  category: string;
  subject: string;
  status: "Pending" | "In-Progress" | "Resolved";
  date: string;
  description?: string;
  assignedTo?: string;
  timeline?: { status: string; date: string; note: string }[];
  comments?: { user: string; message: string; time: string }[];
}

interface ComplaintDetailModalProps {
  complaint: Complaint;
  onClose: () => void;
}

const ComplaintDetailModal = ({ complaint, onClose }: ComplaintDetailModalProps) => {
  const { theme } = useTheme();
  const [newComment, setNewComment] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "timeline" | "comments">("details");

  const defaultTimeline = [
    { status: "Submitted", date: complaint.date, note: "Complaint registered successfully" },
    { status: "Under Review", date: "Jan 19, 2026", note: "Assigned to department" },
    ...(complaint.status === "In-Progress" ? [{ status: "In Progress", date: "Jan 20, 2026", note: "Being processed by faculty" }] : []),
    ...(complaint.status === "Resolved" ? [{ status: "Resolved", date: "Jan 21, 2026", note: "Issue has been resolved" }] : []),
  ];

  const defaultComments = [
    { user: "Faculty", message: "We have received your complaint and will look into it.", time: "Jan 19, 2026 10:30 AM" },
    { user: "You", message: "Thank you for the quick response.", time: "Jan 19, 2026 11:00 AM" },
  ];

  const timeline = complaint.timeline || defaultTimeline;
  const comments = complaint.comments || defaultComments;

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    toast({
      title: "Comment Added",
      description: "Your comment has been added to the complaint.",
    });
    setNewComment("");
  };

  const getModalClasses = () => {
    switch (theme) {
      case "dark":
        return "bg-[#1a1a2e] text-white";
      case "fancy":
        return "bg-gradient-to-br from-[#16213e] to-[#1a1a2e] text-white border border-[#4f6fdc]/30";
      default:
        return "bg-white text-[#1f2937]";
    }
  };

  const getTabClasses = (isActive: boolean) => {
    if (isActive) {
      return theme === "fancy" 
        ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white"
        : "bg-[#4f6fdc] text-white";
    }
    return theme === "light" ? "bg-gray-100 text-[#6b7280]" : "bg-white/10 text-white/70";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-hidden ${getModalClasses()}`}
      >
        {/* Header */}
        <div className={`p-6 border-b ${theme === "light" ? "border-gray-100" : "border-white/10"}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[#4f6fdc] font-semibold">{complaint.id}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  complaint.status === "Pending" ? "badge-pending" :
                  complaint.status === "In-Progress" ? "badge-progress" : "badge-resolved"
                }`}>
                  {complaint.status}
                </span>
              </div>
              <h2 className={`text-xl font-semibold mt-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                {complaint.subject}
              </h2>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/10"}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4">
          {(["details", "timeline", "comments"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${getTabClasses(activeTab === tab)}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 pt-0 max-h-[50vh] overflow-y-auto">
          {activeTab === "details" && (
            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                  Category
                </label>
                <p className={`mt-1 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                  {complaint.category}
                </p>
              </div>
              <div>
                <label className={`text-sm font-medium ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                  Date Submitted
                </label>
                <p className={`mt-1 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                  {complaint.date}
                </p>
              </div>
              <div>
                <label className={`text-sm font-medium ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                  Description
                </label>
                <p className={`mt-1 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                  {complaint.description || `This is a ${complaint.category.toLowerCase()} related issue regarding ${complaint.subject.toLowerCase()}. The student has reported this matter for resolution.`}
                </p>
              </div>
              <div>
                <label className={`text-sm font-medium ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                  Assigned To
                </label>
                <p className={`mt-1 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                  {complaint.assignedTo || "Prof. Sharma (Department Head)"}
                </p>
              </div>
            </div>
          )}

          {activeTab === "timeline" && (
            <div className="relative">
              <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${theme === "light" ? "bg-gray-200" : "bg-white/20"}`} />
              <div className="space-y-6">
                {timeline.map((item, index) => (
                  <div key={index} className="flex gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                      index === timeline.length - 1 
                        ? "bg-[#4f6fdc] text-white" 
                        : theme === "light" ? "bg-gray-100" : "bg-white/10"
                    }`}>
                      {item.status === "Resolved" ? <CheckCircle className="w-4 h-4" /> :
                       item.status === "In Progress" ? <AlertCircle className="w-4 h-4" /> :
                       <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`font-medium ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                        {item.status}
                      </p>
                      <p className={`text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                        {item.date}
                      </p>
                      <p className={`text-sm mt-1 ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "comments" && (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl ${
                    comment.user === "You" 
                      ? "bg-[#4f6fdc]/10 ml-8" 
                      : theme === "light" ? "bg-gray-50 mr-8" : "bg-white/5 mr-8"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-[#4f6fdc]" />
                    <span className={`text-sm font-medium ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                      {comment.user}
                    </span>
                    <span className={`text-xs ${theme === "light" ? "text-[#6b7280]" : "text-white/50"}`}>
                      {comment.time}
                    </span>
                  </div>
                  <p className={`text-sm ${theme === "light" ? "text-[#6b7280]" : "text-white/70"}`}>
                    {comment.message}
                  </p>
                </div>
              ))}
              
              {complaint.status !== "Resolved" && (
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className={`flex-1 px-4 py-3 rounded-xl border outline-none ${
                      theme === "light" 
                        ? "border-gray-200 focus:border-[#4f6fdc] text-[#1f2937]" 
                        : "border-white/20 bg-white/5 focus:border-[#4f6fdc] text-white"
                    }`}
                  />
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-3 rounded-xl bg-[#4f6fdc] text-white hover:bg-[#4560c7] transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ComplaintDetailModal;
