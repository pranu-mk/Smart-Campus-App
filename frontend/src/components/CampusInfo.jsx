import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Content focused on evergreen campus information (No DB needed)
const campusResources = [
  { 
    id: 1, 
    title: 'Academic Calendar 2026', 
    type: 'info', 
    date: 'Full Year', 
    fullContent: 'Access the official university calendar for the 2026 academic cycle, including semester start dates, examination windows, and seasonal breaks. Use this to plan your elective registrations and project submissions.' 
  },
  { 
    id: 2, 
    title: 'Digital Library Access', 
    type: 'resource', 
    date: '24/7 Access', 
    fullContent: 'The central library provides remote access to IEEE, JSTOR, and Elsevier journals. Log in via the student portal using your university credentials to access over 500,000+ e-books and research papers from anywhere.' 
  },
  { 
    id: 3, 
    title: 'Campus Wellness Center', 
    type: 'health', 
    date: 'Mon - Sat', 
    fullContent: 'Located in the Student Activity Center, the Wellness Center offers free counseling, primary healthcare, and emergency medical assistance for all registered students. Walk-ins are welcome from 9 AM to 5 PM.' 
  },
  { 
    id: 4, 
    title: 'Career Placement Cell', 
    type: 'resource', 
    date: 'Ongoing', 
    fullContent: 'The placement cell coordinates internships, campus recruitment drives, and soft-skills workshops. Students are encouraged to update their profiles on the placement portal to receive personalized job alerts.' 
  },
];

const importantLinks = [
  { name: 'Student Portal', icon: '👤', url: '/portal', desc: 'Grades & Attendance' },
  { name: 'LMS - Moodle', icon: '📖', url: '/lms', desc: 'Course Materials' },
  { name: 'Fee Payment', icon: '💳', url: '/fees', desc: 'Online Transactions' },
  { name: 'Bus Routes', icon: '🚌', url: '/transport', desc: 'Campus Shuttle' },
];

const quickContacts = [
  { name: 'Admin Office', dept: 'Main Building', avatar: 'AO' },
  { name: 'IT Support', dept: 'Tech Block', avatar: 'IT' },
  { name: 'Hostel Warden', dept: 'Residential', avatar: 'HW' },
];

export default function CampusInfo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expandedResource, setExpandedResource] = useState(null);

  return (
    <section id="campus" className="py-24 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-secondary/30" />
      
      {/* Ambient floating icons */}
      <motion.div
        className="absolute top-20 left-10 text-3xl opacity-10 pointer-events-none"
        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        🏫
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-3xl opacity-10 pointer-events-none"
        animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        📚
      </motion.div>
      
      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Resource Hub
          </span>
          <h2 className="section-heading text-4xl font-bold">
            Campus <span className="text-gradient">Essentials</span>
          </h2>
          <p className="section-subheading text-muted-foreground mt-4">
            Quick access to permanent university resources and support
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* General Resources (Replacing dynamic notices) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6 border rounded-2xl bg-card/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg">Student Resources</h3>
            </div>
            
            <div className="space-y-3">
              {campusResources.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="rounded-xl hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden border border-transparent hover:border-border"
                >
                  <motion.div
                    onClick={() => setExpandedResource(expandedResource === item.id ? null : item.id)}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 p-3"
                  >
                    <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      item.type === 'health' ? 'bg-red-500' :
                      item.type === 'resource' ? 'bg-emerald-500' : 'bg-primary'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                    </div>
                    <motion.span
                      animate={{ rotate: expandedResource === item.id ? 180 : 0 }}
                      className="text-muted-foreground"
                    >
                      ↓
                    </motion.span>
                  </motion.div>
                  
                  <AnimatePresence>
                    {expandedResource === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-muted/30"
                      >
                        <div className="px-3 pb-3 pt-1">
                          <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-2">
                            {item.fullContent}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links (Replacing dynamic Holidays) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6 border rounded-2xl bg-card/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg">Quick Access</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {importantLinks.map((link, index) => (
                <Link to={link.url} key={link.name}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -2, backgroundColor: 'rgba(var(--accent), 0.1)' }}
                    className="p-3 rounded-xl bg-muted/50 flex items-center gap-4 transition-all"
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{link.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{link.desc}</p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-center text-muted-foreground italic">
                "Education is the most powerful weapon which you can use to change the world."
              </p>
            </div>
          </motion.div>

          {/* Helpdesk (Replacing dynamic Birthdays) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6 border rounded-2xl bg-card/50 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <span className="text-xl">📞</span>
              </div>
              <h3 className="font-display font-semibold text-lg">Campus Helpdesk</h3>
            </div>

            <div className="space-y-4">
              {quickContacts.map((contact, index) => (
                <motion.div
                  key={contact.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-sm">
                    {contact.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.dept}</p>
                  </div>
                  <div className="ml-auto w-8 h-8 rounded-full bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 text-center"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-xs font-semibold text-primary">Emergency Helpline</p>
              <p className="text-lg font-display font-bold mt-1">+91 (123) 456-7890</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}