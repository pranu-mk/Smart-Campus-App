import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

// 2026 Holiday Data as specified
const holidays2026 = [
  { date: '2026-01-26', day: 'Monday', name: 'Republic Day', emoji: '🇮🇳', category: 'National' },
  { date: '2026-02-19', day: 'Thursday', name: 'Chhatrapati Shivaji Maharaj Jayanti', emoji: '⚔️', category: 'State' },
  { date: '2026-03-03', day: 'Tuesday', name: 'Holi', emoji: '🎨', category: 'State' },
  { date: '2026-03-19', day: 'Thursday', name: 'Gudi Padwa', emoji: '🌸', category: 'State' },
  { date: '2026-03-26', day: 'Thursday', name: 'Ram Navami', emoji: '🛕', category: 'State' },
  { date: '2026-03-31', day: 'Tuesday', name: 'Mahavir Jayanti', emoji: '☸️', category: 'State' },
  { date: '2026-04-03', day: 'Friday', name: 'Good Friday', emoji: '✝️', category: 'State' },
  { date: '2026-04-14', day: 'Tuesday', name: 'Dr. Babasaheb Ambedkar Jayanti', emoji: '🪔', category: 'State' },
  { date: '2026-05-01', day: 'Friday', name: 'Maharashtra Day', emoji: '🇮🇳', category: 'State' },
  { date: '2026-05-01', day: 'Friday', name: 'Buddha Purnima', emoji: '☸️', category: 'State' },
  { date: '2026-05-28', day: 'Thursday', name: 'Bakrid (Id-Ul-Zuha)', emoji: '🕌', category: 'State' },
  { date: '2026-06-26', day: 'Friday', name: 'Muharram', emoji: '🌙', category: 'State' },
  { date: '2026-08-26', day: 'Wednesday', name: 'Id-e-Milad', emoji: '🕌', category: 'State' },
  { date: '2026-09-14', day: 'Monday', name: 'Ganesh Chaturthi', emoji: '🐘', category: 'State' },
  { date: '2026-10-02', day: 'Friday', name: 'Mahatma Gandhi Jayanti', emoji: '🕊️', category: 'National' },
  { date: '2026-10-20', day: 'Tuesday', name: 'Vijaya Dashami (Dussehra)', emoji: '🏹', category: 'State' },
  { date: '2026-11-09', day: 'Monday', name: 'Deepavali', emoji: '🪔', category: 'State' },
  { date: '2026-11-24', day: 'Tuesday', name: 'Guru Nanak Jayanti', emoji: '☬', category: 'State' },
  { date: '2026-12-25', day: 'Friday', name: 'Christmas Day', emoji: '🎄', category: 'State' },
];

// Group holidays by month
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const getHolidaysByMonth = () => {
  return months.map((month, index) => {
    const monthNum = (index + 1).toString().padStart(2, '0');
    const monthHolidays = holidays2026.filter(h => h.date.includes(`-${monthNum}-`));
    return { month, holidays: monthHolidays };
  });
};

const academicCalendar = getHolidaysByMonth();

const semesterBreaks = [
  { 
    title: 'Semester 1 Break', 
    dates: 'Dec 15 - Jan 5', 
    description: 'Winter vacation between semesters',
    startDate: 'December 15, 2026',
    endDate: 'January 5, 2027',
    academicRelevance: 'End of odd semester examinations and beginning of new year',
    notes: 'Library remains open with limited hours. Hostel facilities available for outstation students.'
  },
  { 
    title: 'Mid-Semester Break', 
    dates: 'Mar 10 - Mar 17', 
    description: 'Short break during spring semester',
    startDate: 'March 10, 2026',
    endDate: 'March 17, 2026',
    academicRelevance: 'Break after internal assessments, includes Holi celebrations',
    notes: 'Campus events planned for students not traveling home.'
  },
  { 
    title: 'Summer Vacation', 
    dates: 'May 15 - Jun 30', 
    description: 'Extended break after examinations',
    startDate: 'May 15, 2026',
    endDate: 'June 30, 2026',
    academicRelevance: 'Post even-semester exams, internship period for many students',
    notes: 'Summer internship coordination through placement cell. Research projects continue.'
  },
];

const getCategoryColor = (category) => {
  switch (category) {
    case 'National': return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
    case 'State': return 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30';
    case 'Academic': return 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30';
    case 'Festival': return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
    default: return 'bg-muted text-muted-foreground border-border';
  }
};

const getCategoryDot = (category) => {
  switch (category) {
    case 'National': return 'bg-blue-500';
    case 'State': return 'bg-purple-500';
    case 'Academic': return 'bg-green-500';
    case 'Festival': return 'bg-amber-500';
    default: return 'bg-muted-foreground';
  }
};

// Find next upcoming holiday
const getNextHoliday = () => {
  const today = new Date('2026-01-21'); // Current date from context
  for (const holiday of holidays2026) {
    const holidayDate = new Date(holiday.date);
    if (holidayDate >= today) {
      const diffTime = holidayDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...holiday, daysUntil: diffDays };
    }
  }
  return null;
};

// Floating ambient icons
const FloatingIcon = ({ children, delay = 0, duration = 12 }) => (
  <motion.div
    className="absolute text-2xl opacity-10 pointer-events-none select-none"
    style={{
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
    }}
    animate={{
      y: [-20, 20, -20],
      rotate: [-5, 5, -5],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    {children}
  </motion.div>
);

function SemesterBreakCard({ item, index, isExpanded, onToggle }) {
  const nextHoliday = getNextHoliday();
  const isNextBreak = nextHoliday && item.title.includes('Semester 1');

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      whileHover={{ y: -4 }}
      className={`glass-card p-6 cursor-pointer ${isNextBreak ? 'ring-2 ring-primary/50' : ''}`}
      onClick={onToggle}
    >
      {isNextBreak && (
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium mb-3"
        >
          Upcoming
        </motion.span>
      )}
      <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
      <p className="text-primary font-medium mb-2">{item.dates}</p>
      <p className="text-sm text-muted-foreground">{item.description}</p>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Start Date</span>
                <p className="text-sm font-medium">{item.startDate}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">End Date</span>
                <p className="text-sm font-medium">{item.endDate}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Academic Relevance</span>
                <p className="text-sm text-muted-foreground">{item.academicRelevance}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</span>
                <p className="text-sm text-muted-foreground">{item.notes}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        className="mt-4 flex items-center gap-2 text-sm text-primary"
        animate={{ x: isExpanded ? 0 : [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: isExpanded ? 0 : Infinity }}
      >
        <span>{isExpanded ? 'Click to collapse' : 'Click for details'}</span>
        <motion.span animate={{ rotate: isExpanded ? 180 : 0 }}>↓</motion.span>
      </motion.div>
    </motion.div>
  );
}

function MonthCard({ monthData, index, isExpanded, onToggle }) {
  const hasHolidays = monthData.holidays.length > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.03 }}
      className="glass-card overflow-hidden"
    >
      <motion.button
        onClick={onToggle}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
        whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
      >
        <div className="flex items-center gap-4">
          <h3 className="font-display font-semibold text-lg">{monthData.month}</h3>
          {hasHolidays && (
            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {monthData.holidays.length} {monthData.holidays.length === 1 ? 'holiday' : 'holidays'}
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </motion.button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {hasHolidays ? (
                <ul className="space-y-3">
                  {monthData.holidays.map((holiday, i) => (
                    <motion.li 
                      key={`${holiday.date}-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{holiday.emoji}</span>
                        <div>
                          <p className="font-medium text-sm">{holiday.name}</p>
                          <p className="text-xs text-muted-foreground">{holiday.day}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(holiday.category)}`}>
                          {holiday.category}
                        </span>
                        <span className="text-sm text-muted-foreground font-medium">
                          {new Date(holiday.date).getDate()}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground py-2">No holidays this month</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Holidays() {
  const [expandedBreak, setExpandedBreak] = useState(null);
  const [expandedMonth, setExpandedMonth] = useState(null);
  const nextHoliday = getNextHoliday();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      {/* Ambient floating icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingIcon delay={0} duration={14}>📅</FloatingIcon>
        <FloatingIcon delay={2} duration={12}>🎉</FloatingIcon>
        <FloatingIcon delay={4} duration={16}>🌟</FloatingIcon>
        <FloatingIcon delay={6} duration={13}>🎊</FloatingIcon>
      </div>

      <Navbar />
      
      <main className="pt-24 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6"
            >
              Academic Calendar
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
            >
              Upcoming <span className="text-gradient">Holidays</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              View the complete academic calendar and holiday schedule for 2026
            </motion.p>
            
            {/* Next Holiday Banner */}
            {nextHoliday && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-primary/10 border border-primary/20"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  {nextHoliday.emoji}
                </motion.span>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Next Holiday</p>
                  <p className="font-display font-semibold">{nextHoliday.name}</p>
                </div>
                <div className="pl-4 border-l border-primary/20">
                  <p className="text-2xl font-bold text-primary">{nextHoliday.daysUntil}</p>
                  <p className="text-xs text-muted-foreground">days away</p>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Legend */}
        <section className="py-4 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-card p-4"
            >
              <div className="flex flex-wrap items-center justify-center gap-6">
                <span className="text-sm font-medium text-muted-foreground">Legend:</span>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${getCategoryDot('National')}`} />
                  <span className="text-sm">National Holiday</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${getCategoryDot('State')}`} />
                  <span className="text-sm">State Holiday</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${getCategoryDot('Academic')}`} />
                  <span className="text-sm">Academic Break</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${getCategoryDot('Festival')}`} />
                  <span className="text-sm">Festival</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Semester Breaks */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-2xl font-display font-semibold mb-8"
            >
              Semester Breaks
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {semesterBreaks.map((item, index) => (
                <SemesterBreakCard
                  key={item.title}
                  item={item}
                  index={index}
                  isExpanded={expandedBreak === item.title}
                  onToggle={() => setExpandedBreak(expandedBreak === item.title ? null : item.title)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Monthly Calendar - Accordion Style */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-display font-semibold mb-8"
            >
              Holiday Calendar 2026
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {academicCalendar.map((monthData, index) => (
                <MonthCard
                  key={monthData.month}
                  monthData={monthData}
                  index={index}
                  isExpanded={expandedMonth === monthData.month}
                  onToggle={() => setExpandedMonth(expandedMonth === monthData.month ? null : monthData.month)}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </motion.div>
  );
}