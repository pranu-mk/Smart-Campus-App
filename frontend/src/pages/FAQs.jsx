import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const faqCategories = [
  {
    id: 'student',
    title: 'Student',
    icon: '🎓',
    faqs: [
      {
        question: 'How do I submit a complaint?',
        answer: 'Navigate to the Student Helpdesk section, select your complaint category, fill in the required details, and submit. You\'ll receive a tracking ID for future reference.',
      },
      {
        question: 'How can I track my complaint status?',
        answer: 'Use your tracking ID on the complaint status page to view real-time updates on your submission. You\'ll also receive email notifications for any status changes.',
      },
      {
        question: 'How do I register for campus events?',
        answer: 'Visit the Events section, browse upcoming events, and click the register button on any event you wish to attend. Confirmation will be sent to your email.',
      },
      {
        question: 'How can I apply for scholarships?',
        answer: 'Check the Scholarships section for available opportunities, review eligibility criteria, and submit your application with required documents before the deadline.',
      },
      {
        question: 'How do I access my academic records?',
        answer: 'Log into your student portal with your credentials. Navigate to "Academic Records" section to view your grades, attendance, and other academic information.',
      },
      {
        question: 'What are the library operating hours?',
        answer: 'The central library is open Monday-Friday from 8 AM to 11 PM, Saturday from 9 AM to 9 PM, and Sunday from 10 AM to 6 PM. Extended hours during examination periods.',
      },
    ],
  },
  {
    id: 'faculty',
    title: 'Faculty',
    icon: '👨‍🏫',
    faqs: [
      {
        question: 'How do I respond to student complaints?',
        answer: 'Access your dashboard, view pending complaints assigned to your department, and update the status with appropriate resolution notes.',
      },
      {
        question: 'How can I post notices for students?',
        answer: 'Use the Digital Notices section to create and publish announcements. Select the target audience and category for proper distribution.',
      },
      {
        question: 'How do I manage my class schedule?',
        answer: 'The timetable management section allows you to view, modify, and share your teaching schedule with students and other faculty members.',
      },
      {
        question: 'How can I submit leave applications?',
        answer: 'Navigate to "Leave Management" in your faculty portal. Fill in the leave form with dates, reason, and any substitute arrangements. Submit for HOD approval.',
      },
      {
        question: 'How do I upload course materials?',
        answer: 'Use the Learning Management System (LMS) integrated into the platform. Select your course, navigate to "Resources" and upload materials in supported formats.',
      },
    ],
  },
  {
    id: 'admin',
    title: 'Admin',
    icon: '🛠',
    faqs: [
      {
        question: 'How do I add new user accounts?',
        answer: 'Access the User Management panel, select the appropriate role, fill in the required details, and generate login credentials for new users.',
      },
      {
        question: 'How can I generate reports?',
        answer: 'The Analytics dashboard provides various report templates. Select your desired metrics, date range, and export format to generate comprehensive reports.',
      },
      {
        question: 'How do I manage department settings?',
        answer: 'Navigate to Settings > Departments to configure department-specific rules, assign HODs, and manage faculty allocations.',
      },
      {
        question: 'How do I handle escalated complaints?',
        answer: 'Escalated complaints appear in your priority queue. Review the complaint history, coordinate with relevant departments, and ensure resolution within the defined SLA.',
      },
      {
        question: 'How can I update the academic calendar?',
        answer: 'Access "Academic Settings" > "Calendar Management". You can add holidays, events, and semester dates. Changes are reflected across all user dashboards.',
      },
    ],
  },
];

// Floating ambient icons
const FloatingIcon = ({ children, delay = 0, duration = 12 }) => (
  <motion.div
    className="absolute text-2xl opacity-10 pointer-events-none select-none"
    style={{
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
    }}
    animate={{
      y: [-15, 15, -15],
      rotate: [-3, 3, -3],
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

function FAQItem({ faq, index, isOpen, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card overflow-hidden"
    >
      <motion.button
        onClick={onClick}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/30 transition-colors"
        whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.3)' }}
      >
        <span className="font-medium pr-4">{faq.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQs() {
  const [activeCategory, setActiveCategory] = useState('student');
  const [openFaqs, setOpenFaqs] = useState({});

  const currentCategory = faqCategories.find(cat => cat.id === activeCategory);

  const toggleFaq = (categoryId, index) => {
    const key = `${categoryId}-${index}`;
    setOpenFaqs(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isFaqOpen = (categoryId, index) => {
    return openFaqs[`${categoryId}-${index}`] || false;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background relative overflow-hidden"
    >
      {/* Ambient floating icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <FloatingIcon delay={0} duration={14}>❓</FloatingIcon>
        <FloatingIcon delay={2} duration={12}>💡</FloatingIcon>
        <FloatingIcon delay={4} duration={16}>🔍</FloatingIcon>
        <FloatingIcon delay={6} duration={13}>📋</FloatingIcon>
      </div>

      <Navbar />
      
      <main className="pt-24 pb-16 relative z-10">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              Help Center
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
            >
              Frequently Asked <span className="text-gradient">Questions</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Find quick answers to common questions about our platform
            </motion.p>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              {faqCategories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all ${
                    activeCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.title}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {currentCategory?.faqs.map((faq, index) => (
                  <FAQItem
                    key={`${activeCategory}-${index}`}
                    faq={faq}
                    index={index}
                    isOpen={isFaqOpen(activeCategory, index)}
                    onClick={() => toggleFaq(activeCategory, index)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-8 text-center"
            >
              <h2 className="font-display font-semibold text-2xl mb-4">Still have questions?</h2>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <Link to="/contact">
                <motion.button
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Support
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </motion.div>
  );
}