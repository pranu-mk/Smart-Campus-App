import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const TRACKING_STEPS = [
  { id: 1, label: 'Submitted', icon: '📝', color: 'bg-blue-500' },
  { id: 2, label: 'Verified', icon: '🔍', color: 'bg-yellow-500' },
  { id: 3, label: 'In Progress', icon: '⚙️', color: 'bg-purple-500' },
  { id: 4, label: 'Resolved', icon: '✅', color: 'bg-emerald-500' },
];

export default function ComplaintPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [activeStep, setActiveStep] = useState(0);

  // Auto-animate the tracking steps for a "live" feel
  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % TRACKING_STEPS.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-background">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5" />
      
      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 tracking-wide uppercase">
              Transparency First
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
              Track Every Issue 
              <span className="text-gradient block">In Real-Time</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              No more "black hole" complaints. Our Smart Campus engine provides 
              end-to-end visibility. From the moment you hit submit, watch your 
              grievance move through our automated verification and resolution pipeline.
            </p>
            
            <div className="space-y-4">
              {['Smart AI Routing', '24/7 Status Updates', 'Direct Admin Chat'].map((feature, i) => (
                <motion.div 
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + (i * 0.1) }}
                  className="flex items-center gap-3 text-foreground font-medium"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Live Status Tracker Simulation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass-card p-1 dark:bg-white/5 border-white/10 shadow-2xl">
              <div className="bg-background/50 rounded-2xl p-6 md:p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1"></p>
                    <h4 className="text-lg font-semibold">Hostel Wi-Fi Connectivity</h4>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold animate-pulse">
                      Live Update
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-12 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-primary"
                    animate={{ width: `${(activeStep / (TRACKING_STEPS.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-4 gap-2">
                  {TRACKING_STEPS.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <motion.div
                        animate={{ 
                          scale: activeStep === index ? 1.2 : 1,
                          backgroundColor: activeStep >= index ? 'var(--primary)' : 'rgba(var(--muted), 1)'
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg transition-colors duration-500 ${
                          activeStep >= index ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {step.icon}
                      </motion.div>
                      <span className={`text-[10px] md:text-xs mt-3 font-bold uppercase tracking-tighter ${
                        activeStep === index ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-6 border-t border-border">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-start gap-4"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 animate-ping ${TRACKING_STEPS[activeStep].color}`} />
                      <div>
                        <p className="text-sm font-medium italic text-muted-foreground">
                          {activeStep === 0 && "Complaint logged into system. Assigning to Technician..."}
                          {activeStep === 1 && "Admin has verified the issue. Priority set to 'High'."}
                          {activeStep === 2 && "Technician is currently on-site at Hostel Block B."}
                          {activeStep === 3 && "Resolution confirmed. Requesting student feedback."}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 blur-3xl rounded-full" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary/10 blur-3xl rounded-full" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}