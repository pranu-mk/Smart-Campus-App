import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
const features = [
  { icon: '🎯', text: 'Centralized campus services' },
  { icon: '⚡', text: 'Real-time updates & notifications' },
  { icon: '🔒', text: 'Secure & private' },
  { icon: '📱', text: 'Access anywhere, anytime' },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left - Decorative */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Animated rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border border-primary/20"
                  style={{ 
                    margin: `${i * 30}px`,
                  }}
                  animate={{
                    rotate: 360,
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 20 + i * 5,
                      repeat: Infinity,
                      ease: 'linear',
                    },
                    scale: {
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                    },
                  }}
                />
              ))}

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-48 h-48 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <span className="text-6xl font-display font-bold text-primary-foreground">SC</span>
                </motion.div>
              </div>

              {/* Floating icons */}
              {features.map((feature, index) => {
                const angle = (index * 90 + 45) * (Math.PI / 180);
                const radius = 160;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={feature.text}
                    className="absolute w-14 h-14 rounded-2xl glass-card flex items-center justify-center text-2xl"
                    style={{
                      left: `calc(50% + ${x}px - 28px)`,
                      top: `calc(50% + ${y}px - 28px)`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    {feature.icon}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              About Us
            </span>
            <h2 className="section-heading text-left">
              Redefining
              <span className="text-gradient block mt-2">Campus Experience</span>
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              SmartCampus Portal brings together all essential campus services into one intelligent platform. 
              We believe in making education technology seamless, accessible, and empowering for everyone.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="font-medium">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            <Link to="/about-platform">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
                <span className="ml-2">→</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Animated divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{ duration: 1, delay: 0.8 }}
        className="max-w-4xl mx-auto mt-24 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />
    </section>
  );
}
