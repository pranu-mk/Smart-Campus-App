import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// Content pivoted to Global Campus Milestones (No DB needed)
const stats = [
  { 
    value: 15000, 
    label: 'Alumni Network',
    suffix: '+',
    color: 'primary',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  { 
    value: 98, 
    label: 'Success Rate',
    suffix: '%',
    color: 'green',
    percentage: 98,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  { 
    value: 120, 
    label: 'Corporate Partners',
    suffix: '+',
    color: 'blue',
    percentage: 92, // Partnership Strength
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  { 
    value: 450, 
    label: 'Annual Events',
    suffix: '',
    color: 'yellow',
    percentage: 100,
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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
          className="text-muted/20"
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
    <section className="py-24 px-4 relative overflow-hidden bg-background">
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Global Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display tracking-tight mb-4">
            Our Legacy in <span className="text-gradient">Numbers</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Empowering students and building a global community of innovators and leaders.
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
              className="p-8 rounded-3xl bg-card border border-border/50 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Background glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${
                stat.color === 'green' ? 'from-green-500/5' :
                stat.color === 'yellow' ? 'from-yellow-500/5' :
                stat.color === 'blue' ? 'from-blue-500/5' :
                'from-primary/5'
              } to-transparent`} />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center ${
                  stat.color === 'green' ? 'bg-green-500/10 text-green-500' :
                  stat.color === 'yellow' ? 'bg-yellow-500/10 text-yellow-500' :
                  stat.color === 'blue' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-primary/10 text-primary'
                }`}>
                  {stat.icon}
                </div>

                <div className="text-4xl font-display font-bold mb-2">
                  <CountUpNumber value={stat.value} />
                  {stat.suffix}
                </div>
                
                <p className="text-muted-foreground font-medium text-sm mb-6">{stat.label}</p>

                {stat.percentage && (
                  <ProgressRing percentage={stat.percentage} color={stat.color} />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Impact Bar (Re-contextualized for wholesome growth) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 glass-card p-8 border rounded-3xl bg-card/50 backdrop-blur-md"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h4 className="font-display font-bold text-xl text-foreground">Community Growth Breakdown</h4>
            <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
              Est. 2026 Academic Projection
            </div>
          </div>
          
          <div className="h-4 bg-muted/50 rounded-full overflow-hidden flex">
            <motion.div
              className="bg-primary h-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: '60%' } : {}}
              transition={{ duration: 1.5, delay: 0.7, ease: 'easeOut' }}
            />
            <motion.div
              className="bg-green-500 h-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: '25%' } : {}}
              transition={{ duration: 1.5, delay: 0.9, ease: 'easeOut' }}
            />
            <motion.div
              className="bg-blue-500 h-full"
              initial={{ width: 0 }}
              animate={isInView ? { width: '15%' } : {}}
              transition={{ duration: 1.5, delay: 1.1, ease: 'easeOut' }}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-semibold">Undergraduate</p>
                <p className="text-[10px] text-muted-foreground uppercase">Foundational Excellence</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-semibold">Postgraduate</p>
                <p className="text-[10px] text-muted-foreground uppercase">Advanced Research</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-semibold">Professional</p>
                <p className="text-[10px] text-muted-foreground uppercase">Continuing Education</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}