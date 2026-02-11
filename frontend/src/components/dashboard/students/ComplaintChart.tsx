import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

// 1. Define what data the chart expects to receive
interface ComplaintChartProps {
  stats: {
    pending: number;
    inProgress: number;
    resolved: number;
  };
}

const ComplaintChart = ({ stats }: ComplaintChartProps) => {
  // 2. Map your live stats to the format Recharts needs
 const chartData = [
  { name: "Pending", value: Number(stats?.pending) || 0, color: "#f6c453" },
  { name: "In-Progress", value: Number(stats?.inProgress) || 0, color: "#f39c3d" },
  { name: "Resolved", value: Number(stats?.resolved) || 0, color: "#49b675" },
];
  // 3. Check if there is any data to show (optional helper)
  const hasData = chartData.some(item => item.value > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-white rounded-2xl shadow-card p-6"
    >
      <h3 className="text-lg font-semibold text-[#1f2937] mb-4">Complaint Status Overview</h3>
      <div className="h-64">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => (
                  <span style={{ color: "#6b7280", fontSize: "14px" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p className="text-sm">No data available yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ComplaintChart;