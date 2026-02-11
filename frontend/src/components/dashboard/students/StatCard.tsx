import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  variant: "blue" | "yellow" | "orange" | "green";
  delay?: number;
}

const variantClasses = {
  blue: "stat-card-blue",
  yellow: "stat-card-yellow",
  orange: "stat-card-orange",
  green: "stat-card-green",
};

const StatCard = ({ title, value, icon: Icon, variant, delay = 0 }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={`${variantClasses[variant]} rounded-2xl p-6 text-white shadow-card hover:shadow-card-hover transition-shadow cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{value}</h3>
        </div>
        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
