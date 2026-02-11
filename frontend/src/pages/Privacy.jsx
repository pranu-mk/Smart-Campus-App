import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const sections = [
  {
    title: 'Information We Collect',
    content: [
      'Personal information (name, email, student/faculty ID) provided during registration',
      'Academic information relevant to your role on campus',
      'Usage data and interaction patterns with our platform',
      'Device information and browser type for optimization purposes',
      'Feedback and communications you submit through our platform',
    ],
  },
  {
    title: 'How We Use Your Information',
    content: [
      'To provide and maintain our campus services',
      'To process and track complaints and requests',
      'To send important notifications and updates',
      'To improve our platform based on usage patterns',
      'To ensure security and prevent unauthorized access',
    ],
  },
  {
    title: 'Data Protection',
    content: [
      'All data is encrypted in transit and at rest',
      'Access is restricted to authorized personnel only',
      'Regular security audits and vulnerability assessments',
      'Compliance with educational data protection standards',
      'Secure backup and disaster recovery procedures',
    ],
  },
  {
    title: 'Your Rights',
    content: [
      'Access and view your personal data',
      'Request correction of inaccurate information',
      'Request deletion of your account and data',
      'Opt-out of non-essential communications',
      'Export your data in a portable format',
    ],
  },
  {
    title: 'Data Sharing',
    content: [
      'We do not sell your personal information',
      'Data may be shared with relevant departments for service delivery',
      'Third-party integrations are vetted for security compliance',
      'Legal disclosures only when required by law',
      'Anonymous, aggregated data may be used for research',
    ],
  },
];

export default function Privacy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            >
              Legal
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
            >
              Privacy <span className="text-gradient">Policy</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Last updated: January 20, 2024
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <p className="text-muted-foreground mb-12">
                SmartCampus Portal ("we", "our", or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our campus management platform.
              </p>
            </motion.div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="glass-card p-8"
                >
                  <h2 className="font-display font-semibold text-xl mb-6">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 glass-card p-8 text-center"
            >
              <h2 className="font-display font-semibold text-xl mb-4">Questions?</h2>
              <p className="text-muted-foreground mb-6">
                If you have questions about this Privacy Policy, please contact us.
              </p>
              <a href="/contact" className="btn-primary inline-block">
                Contact Us
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </motion.div>
  );
}
