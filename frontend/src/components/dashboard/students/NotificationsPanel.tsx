import { motion } from "framer-motion";
import { Bell, Calendar, Briefcase, FileText } from "lucide-react";

interface Notification {
  id: string;
  type: "complaint" | "notice" | "event" | "placement";
  title: string;
  time: string;
}

const iconMap = {
  complaint: Bell,
  notice: FileText,
  event: Calendar,
  placement: Briefcase,
};

const colorMap = {
  complaint: "#4f6fdc",
  notice: "#f6c453",
  event: "#49b675",
  placement: "#f39c3d",
};

interface NotificationsPanelProps {
  notifications: Notification[];
}

const NotificationsPanel = ({ notifications }: NotificationsPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-white rounded-2xl shadow-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1f2937]">Notifications</h3>
        <span className="text-xs text-[#4f6fdc] font-medium cursor-pointer hover:underline">View All</span>
      </div>
      <div className="space-y-3">
        {notifications.map((notification, index) => {
          const Icon = iconMap[notification.type];
          const color = colorMap[notification.type];
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#1f2937] font-medium truncate">{notification.title}</p>
                <p className="text-xs text-[#6b7280]">{notification.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NotificationsPanel;
