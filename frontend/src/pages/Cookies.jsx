import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const cookieTypes = [
  {
    title: 'Essential Cookies',
    description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.',
    required: true,
  },
  {
    title: 'Performance Cookies',
    description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.',
    required: false,
  },
  {
    title: 'Functional Cookies',
    description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.',
    required: false,
  },
  {
    title: 'Preference Cookies',
    description: 'These cookies store your preferences such as theme selection (light/dark mode), language settings, and other customization options to enhance your browsing experience.',
    required: false,
  },
];

export default function Cookies() {
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
              Cookie <span className="text-gradient">Policy</span>
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
              className="glass-card p-8 mb-8"
            >
              <h2 className="font-display font-semibold text-xl mb-4">What Are Cookies?</h2>
              <p className="text-muted-foreground leading-relaxed">
                Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
                They are widely used to make websites work more efficiently, provide a better user experience, 
                and provide information to the owners of the site. Our platform uses cookies to remember your 
                preferences and improve your browsing experience.
              </p>
            </motion.div>

            <div className="space-y-6">
              {cookieTypes.map((cookie, index) => (
                <motion.div
                  key={cookie.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="glass-card p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="font-display font-semibold text-xl">{cookie.title}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cookie.required 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {cookie.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{cookie.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 glass-card p-8"
            >
              <h2 className="font-display font-semibold text-xl mb-4">Managing Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most web browsers allow you to control cookies through their settings preferences. 
                However, limiting cookies may affect your experience using our platform.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                You can manage your cookie preferences by adjusting your browser settings. 
                Please note that essential cookies cannot be disabled as they are necessary 
                for the basic functioning of our platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-8 glass-card p-8 text-center"
            >
              <h2 className="font-display font-semibold text-xl mb-4">Questions?</h2>
              <p className="text-muted-foreground mb-6">
                If you have any questions about our use of cookies, please contact us.
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
