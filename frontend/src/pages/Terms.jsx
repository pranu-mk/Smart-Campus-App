import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing and using the SmartCampus Portal, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.',
  },
  {
    title: 'User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate and complete information during registration and to update your information as needed. You are solely responsible for all activities that occur under your account.',
  },
  {
    title: 'Acceptable Use',
    content: 'You agree to use the platform only for lawful purposes and in accordance with institutional policies. You shall not use the platform to harass, abuse, or harm others, submit false information, attempt unauthorized access, or interfere with platform operations.',
  },
  {
    title: 'Complaint Submission',
    content: 'When submitting complaints or requests, you agree to provide truthful and accurate information. False or malicious complaints may result in disciplinary action. The platform is not responsible for the resolution timeline, which depends on the nature of the issue and relevant departments.',
  },
  {
    title: 'Intellectual Property',
    content: 'All content, features, and functionality of the SmartCampus Portal are owned by the institution and are protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.',
  },
  {
    title: 'Limitation of Liability',
    content: 'The platform is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.',
  },
  {
    title: 'Modifications',
    content: 'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the modified terms. We will notify users of significant changes through the platform.',
  },
  {
    title: 'Termination',
    content: 'We may terminate or suspend your account and access to the platform at our discretion, without notice, for conduct that violates these terms or is harmful to other users, the institution, or third parties.',
  },
];

export default function Terms() {
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
              Terms of <span className="text-gradient">Service</span>
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
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="glass-card p-8"
              >
                <h2 className="font-display font-semibold text-xl mb-4">
                  {index + 1}. {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              className="glass-card p-8 text-center"
            >
              <h2 className="font-display font-semibold text-xl mb-4">Questions about these Terms?</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions regarding these Terms of Service, please reach out to us.
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
