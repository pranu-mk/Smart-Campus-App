import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';

// Updated holiday data for 2026
const upcomingHolidays = [
  { name: 'Republic Day', date: 'Jan 26', emoji: '🇮🇳', category: 'National' },
  { name: 'Shivaji Jayanti', date: 'Feb 19', emoji: '⚔️', category: 'State' },
  { name: 'Holi', date: 'Mar 3', emoji: '🎨', category: 'State' },
  { name: 'Gudi Padwa', date: 'Mar 19', emoji: '🌸', category: 'State' },
];

const notices = [
  { id: 1, title: 'Mid-semester exams schedule released', type: 'important', date: 'Jan 15', fullContent: 'The examination department has released the complete mid-semester examination schedule. Students are advised to check the detailed timetable on the student portal. The exams will commence from February 1st and conclude on February 15th. Hall tickets will be available for download from January 25th.' },
  { id: 2, title: 'Library hours extended till 10 PM', type: 'info', date: 'Jan 14', fullContent: 'In response to student requests during the examination period, the Central Library will now remain open until 10 PM on all weekdays. Weekend hours remain unchanged. Students must carry valid ID cards for entry after 6 PM.' },
  { id: 3, title: 'Sports day registration open', type: 'event', date: 'Jan 13', fullContent: 'Annual Sports Day 2026 registrations are now open. Events include athletics, football, basketball, badminton, and chess. Register through the sports portal by January 20th. Team events require captain registration with team member details.' },
  { id: 4, title: 'New cafeteria menu available', type: 'info', date: 'Jan 12', fullContent: 'The campus cafeteria has introduced a new healthy menu with vegetarian, vegan, and high-protein options. Special student meal deals available between 12 PM and 2 PM. Feedback can be submitted through the facilities management portal.' },
];

const birthdays = [
  { name: 'John Doe', dept: 'CS', avatar: 'JD' },
  { name: 'Sarah Miller', dept: 'ECE', avatar: 'SM' },
  { name: 'Mike Chen', dept: 'ME', avatar: 'MC' },
];

// Calculate days until next holiday (from Jan 21, 2026)
const getDaysUntilHoliday = () => {
  return 5; // Jan 26 - Jan 21 = 5 days
};

export default function CampusInfo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [expandedNotice, setExpandedNotice] = useState(null);
  const [expandedHoliday, setExpandedHoliday] = useState(null);

  return (
    <section id="campus" className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-transparent to-secondary/30" />
      
      {/* Ambient floating icons */}
      <motion.div
        className="absolute top-20 left-10 text-3xl opacity-10 pointer-events-none"
        animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        📅
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-3xl opacity-10 pointer-events-none"
        animate={{ y: [10, -10, 10], rotate: [5, -5, 5] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      >
        🎓
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
            Campus Life
          </span>
          <h2 className="section-heading">
            Stay <span className="text-gradient">Informed</span>
          </h2>
          <p className="section-subheading">
            Never miss what's happening on campus
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Notices with inline expand */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg">Latest Notices</h3>
            </div>
            
            <div className="space-y-3">
              {notices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="rounded-xl hover:bg-muted/50 transition-colors cursor-pointer overflow-hidden"
                >
                  <motion.div
                    onClick={() => setExpandedNotice(expandedNotice === notice.id ? null : notice.id)}
                    whileHover={{ x: 4 }}
                    className="flex items-start gap-3 p-3"
                  >
                    <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      notice.type === 'important' ? 'bg-destructive' :
                      notice.type === 'event' ? 'bg-accent' : 'bg-primary'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{notice.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notice.date}</p>
                    </div>
                    <motion.span
                      animate={{ rotate: expandedNotice === notice.id ? 180 : 0 }}
                      className="text-muted-foreground"
                    >
                      ↓
                    </motion.span>
                  </motion.div>
                  
                  <AnimatePresence>
                    {expandedNotice === notice.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 pt-1">
                          <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-2">
                            {notice.fullContent}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
            
            <Link to="/latest-news">
              <motion.button
                className="mt-4 w-full py-2 rounded-lg bg-muted hover:bg-primary/10 text-sm font-medium transition-colors"
                whileHover={{ scale: 1.01 }}
              >
                View All Notices →
              </motion.button>
            </Link>
          </motion.div>

          {/* Holidays with inline expand */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display font-semibold text-lg">Upcoming Holidays</h3>
            </div>

            <div className="space-y-2">
              {upcomingHolidays.map((holiday, index) => (
                <motion.div
                  key={holiday.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  onClick={() => setExpandedHoliday(expandedHoliday === holiday.name ? null : holiday.name)}
                  className="rounded-xl bg-muted/50 hover:bg-accent/10 transition-colors cursor-pointer overflow-hidden"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="px-4 py-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span>{holiday.emoji}</span>
                      <span className="font-medium text-sm">{holiday.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">{holiday.date}</span>
                      <motion.span
                        animate={{ rotate: expandedHoliday === holiday.name ? 180 : 0 }}
                        className="text-muted-foreground text-xs"
                      >
                        ↓
                      </motion.span>
                    </div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {expandedHoliday === holiday.name && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 pt-1 border-t border-border/30">
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              holiday.category === 'National' 
                                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' 
                                : 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                            }`}>
                              {holiday.category}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {holiday.category === 'National' ? 'National holiday - All offices closed' : 'State holiday - Limited operations'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <motion.div
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center justify-between"
              >
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Next Holiday:</span> Republic Day
                </p>
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  in {getDaysUntilHoliday()} days
                </span>
              </motion.div>
            </div>
            
            <Link to="/holidays">
              <motion.button
                className="mt-4 w-full py-2 rounded-lg bg-muted hover:bg-accent/10 text-sm font-medium transition-colors"
                whileHover={{ scale: 1.01 }}
              >
                View Full Calendar →
              </motion.button>
            </Link>
          </motion.div>

          {/* Birthdays */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <span className="text-xl">🎂</span>
              </div>
              <h3 className="font-display font-semibold text-lg">Today's Birthdays</h3>
            </div>

            <div className="space-y-4">
              {birthdays.map((person, index) => (
                <motion.div
                  key={person.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {person.avatar}
                  </motion.div>
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-muted-foreground">{person.dept} Department</p>
                  </div>
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-auto text-xl"
                  >
                    🎉
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}