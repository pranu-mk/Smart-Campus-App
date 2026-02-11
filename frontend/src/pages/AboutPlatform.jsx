import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const studentBenefits = [
  { icon: '📱', text: 'A single digital platform for students to raise, track, and resolve campus issues effortlessly' },
  { icon: '🕐', text: 'Submit complaints anytime without visiting multiple offices' },
  { icon: '🔔', text: 'Real-time status updates for every request or complaint' },
  { icon: '⚖️', text: 'Fair and transparent handling of student concerns' },
  { icon: '⚡', text: 'Reduced delays through structured digital workflows' },
  { icon: '👁️', text: 'Clear visibility into resolution progress' },
  { icon: '📄', text: 'Minimal paperwork and fewer repetitive follow-ups' },
  { icon: '🤝', text: 'Improved trust between students and the institution' },
  { icon: '📢', text: 'Designed to make student voices heard officially' },
  { icon: '✅', text: 'Faster resolutions leading to higher student satisfaction' },
];

const platformBenefits = [
  { icon: '🖥️', text: 'A unified student operating system for campus management' },
  { icon: '👨‍🏫', text: 'Faculty can receive, manage, and resolve issues efficiently' },
  { icon: '🔐', text: 'Role-based access ensures accountability' },
  { icon: '🔗', text: 'Streamlined inter-department communication' },
  { icon: '✨', text: 'Clean, intuitive, professional interface' },
  { icon: '🛡️', text: 'Secure authentication and data privacy compliance' },
  { icon: '📈', text: 'Scalable across departments and institutions' },
  { icon: '🔍', text: 'Transparency at every operational level' },
  { icon: '⏱️', text: 'Reduced manual workload for faculty and staff' },
  { icon: '🏛️', text: 'Acts as a digital backbone for modern campuses' },
];

const departments = [
  {
    name: 'Computer Science',
    shortName: 'CS',
    hodName: 'Dr. Rajesh Kumar',
    designation: 'Head of Department',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Information Technology',
    shortName: 'IT',
    hodName: 'Dr. Priya Sharma',
    designation: 'Head of Department',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Civil Engineering',
    shortName: 'CE',
    hodName: 'Prof. Amit Patel',
    designation: 'Head of Department',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Mechanical Engineering',
    shortName: 'ME',
    hodName: 'Dr. Suresh Verma',
    designation: 'Head of Department',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'Electronics & Telecom',
    shortName: 'ENTC',
    hodName: 'Dr. Meera Joshi',
    designation: 'Head of Department',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  },
  {
    name: 'AI & Machine Learning',
    shortName: 'AI/ML',
    hodName: 'Dr. Vikram Singh',
    designation: 'Head of Department',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
  },
];

function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            About the Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
            A Smarter Way to
            <span className="text-gradient block mt-2">Manage Campus Life</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A unified digital platform connecting students, faculty, and administration 
            for seamless campus operations and transparent communication.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function BenefitCard({ icon, text, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group flex items-start gap-4 p-4 rounded-xl bg-card/50 border border-border/50 hover:bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
    >
      <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </span>
      <p className="text-foreground/90 leading-relaxed">{text}</p>
    </motion.div>
  );
}

function ValueSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-heading">
            Value for
            <span className="text-gradient"> Everyone</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Designed to empower every stakeholder in the campus ecosystem
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Student Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="glass-card p-8 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Student Advantage</h3>
                  <p className="text-muted-foreground">Complaint Resolution & Support</p>
                </div>
              </div>
              <div className="space-y-3">
                {studentBenefits.map((benefit, index) => (
                  <BenefitCard key={index} {...benefit} index={index} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Platform Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="glass-card p-8 h-full">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <span className="text-2xl">🏛️</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Platform Value</h3>
                  <p className="text-muted-foreground">Faculty & System Benefits</p>
                </div>
              </div>
              <div className="space-y-3">
                {platformBenefits.map((benefit, index) => (
                  <BenefitCard key={index} {...benefit} index={index} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function DepartmentCard({ department, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass-card p-6 text-center hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500">
        {/* Department Badge */}
        <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          {department.shortName}
        </div>

        {/* HOD Photo */}
        <div className="relative w-28 h-28 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
            <div className="w-full h-full rounded-full overflow-hidden bg-background">
              <img
                src={department.photo}
                alt={department.hodName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Department Name */}
        <h3 className="text-lg font-bold mb-2">{department.name}</h3>

        {/* HOD Info */}
        <div className="border-t border-border/50 pt-4 mt-4">
          <p className="font-semibold text-foreground">{department.hodName}</p>
          <p className="text-sm text-muted-foreground">{department.designation}</p>
        </div>
      </div>
    </motion.div>
  );
}

function DepartmentsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-4 relative bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            Academic Structure
          </span>
          <h2 className="section-heading">
            Departments Powered by
            <span className="text-gradient"> the Platform</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Each department is seamlessly integrated with full HOD visibility and management capabilities
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <DepartmentCard key={dept.shortName} department={dept} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
          Ready to Experience
          <span className="text-gradient"> Smart Campus?</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10">
          Join thousands of students and faculty members who are already benefiting 
          from streamlined campus operations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register">
            <motion.button
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
              <span className="ml-2">→</span>
            </motion.button>
          </Link>
          <Link to="/">
            <motion.button
              className="px-8 py-3 rounded-xl border border-border hover:bg-card transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

export default function AboutPlatform() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Navbar />
      <HeroSection />
      <ValueSection />
      <DepartmentsSection />
      <CTASection />
      <Footer />
      <BackToTop />
    </motion.div>
  );
}
