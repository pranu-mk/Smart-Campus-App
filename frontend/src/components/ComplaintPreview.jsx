import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export default function ComplaintPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [focused, setFocused] = useState(null);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/20 to-transparent" />
      
      <div ref={ref} className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Quick Access
            </span>
            <h2 className="section-heading">
              Get Started with Your
              <span className="text-gradient block mt-2">Campus Complaint</span>
            </h2>
            <p className="section-subheading text-left mb-8">
              Submit your concerns quickly and track resolution in real-time. 
              Our streamlined system ensures your voice is heard.
            </p>
            
            <div className="flex flex-wrap gap-4">
              {['Infrastructure', 'Academic', 'Hostel', 'Other'].map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Right - Floating Card */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
            className="glass-card p-8"
          >
            <h3 className="text-xl font-display font-semibold mb-6 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
              Quick Complaint Form
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Category
                </label>
                <motion.select
                  className="input-field cursor-pointer"
                  onFocus={() => setFocused('category')}
                  onBlur={() => setFocused(null)}
                  animate={{ scale: focused === 'category' ? 1.01 : 1 }}
                >
                  <option>Select category...</option>
                  <option>Infrastructure</option>
                  <option>Academic</option>
                  <option>Hostel</option>
                </motion.select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Subject
                </label>
                <motion.input
                  type="text"
                  placeholder="Brief subject of your complaint"
                  className="input-field"
                  onFocus={() => setFocused('subject')}
                  onBlur={() => setFocused(null)}
                  animate={{ scale: focused === 'subject' ? 1.01 : 1 }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Description
                </label>
                <motion.textarea
                  rows={3}
                  placeholder="Describe your issue..."
                  className="input-field resize-none"
                  onFocus={() => setFocused('desc')}
                  onBlur={() => setFocused(null)}
                  animate={{ scale: focused === 'desc' ? 1.01 : 1 }}
                />
              </div>

              <motion.button
                className="btn-primary w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Complaint
                <span className="ml-2">→</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
