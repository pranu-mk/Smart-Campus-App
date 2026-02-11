import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  delay?: number;
}

const QuickActionCard = ({ title, description, icon: Icon, path, delay = 0 }: QuickActionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
    >
      <Link
        to={path}
        className="block bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all border border-gray-100 group"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#4f6fdc]/10 flex items-center justify-center group-hover:bg-[#4f6fdc] transition-colors">
            <Icon className="w-6 h-6 text-[#4f6fdc] group-hover:text-white transition-colors" />
          </div>
          <div className="flex-1">
            <h3 className="text-[#1f2937] font-semibold mb-1">{title}</h3>
            <p className="text-[#6b7280] text-sm">{description}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default QuickActionCard;
