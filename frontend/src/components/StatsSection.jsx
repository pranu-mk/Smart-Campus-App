import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const stats = [
  { 
    value: 1247, 
    label: 'Total Complaints',
    color: 'primary',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  { 
    value: 1089, 
    label: 'Resolved',
    color: 'green',
    percentage: 87,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  { 
    value: 98, 
    label: 'Pending',
    color: 'yellow',
    percentage: 8,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  { 
    value: 60, 
    label: 'In Progress',
    color: 'blue',
    percentage: 5,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

function CountUpNumber({ value, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function ProgressRing({ percentage, color, size = 80 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const circumference = 2 * Math.PI * 35;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClass = {
    green: 'stroke-green-500',
    yellow: 'stroke-yellow-500',
    blue: 'stroke-blue-500',
    primary: 'stroke-primary',
  };

  return (
    <div ref={ref} className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={35}
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-muted/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={35}
          strokeWidth="6"
          fill="none"
          className={colorClass[color]}
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={isInView ? { strokeDashoffset } : {}}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold">{percentage}%</span>
      </div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-24 px-4 relative">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            System Overview
          </span>
          <h2 className="section-heading">
            Complaint <span className="text-gradient">Statistics</span>
          </h2>
          <p className="section-subheading">
            Real-time overview of campus complaint resolution
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="stat-card relative overflow-hidden group"
            >
              {/* Background glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${
                stat.color === 'green' ? 'from-green-500/10' :
                stat.color === 'yellow' ? 'from-yellow-500/10' :
                stat.color === 'blue' ? 'from-blue-500/10' :
                'from-primary/10'
              } to-transparent`} />

              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl mb-4 flex items-center justify-center mx-auto ${
                  stat.color === 'green' ? 'bg-green-500/10 text-green-500' :
                  stat.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-500' :
                  stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-primary/10 text-primary'
                }`}>
                  {stat.icon}
                </div>

                <div className="text-4xl font-display font-bold mb-2">
                  <CountUpNumber value={stat.value} />
                </div>
                
                <p className="text-muted-foreground font-medium">{stat.label}</p>

                {stat.percentage && (
                  <div className="mt-4 flex justify-center">
                    <ProgressRing percentage={stat.percentage} color={stat.color} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar Summary */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 glass-card p-6"
        >
          <h4 className="font-display font-semibold mb-4">Resolution Overview</h4>
          <div className="h-4 bg-muted rounded-full overflow-hidden flex">
            <motion.div
              className="bg-green-500 h-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: '87%' } : {}}
              transition={{ duration: 1.5, delay: 0.7, ease: 'easeOut' }}
            />
            <motion.div
              className="bg-blue-500 h-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: '5%' } : {}}
              transition={{ duration: 1.5, delay: 0.9, ease: 'easeOut' }}
            />
            <motion.div
              className="bg-yellow-500 h-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: '8%' } : {}}
              transition={{ duration: 1.5, delay: 1.1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              Resolved (87%)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              In Progress (5%)
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              Pending (8%)
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
