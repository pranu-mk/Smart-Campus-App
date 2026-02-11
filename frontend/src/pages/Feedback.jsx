import { motion } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const feedbackTypes = [
  { id: 'suggestion', label: 'Suggestion', icon: '💡' },
  { id: 'bug', label: 'Bug Report', icon: '🐛' },
  { id: 'feature', label: 'Feature Request', icon: '✨' },
  { id: 'general', label: 'General', icon: '💬' },
];

const ratingLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

export default function Feedback() {
  const [formData, setFormData] = useState({
    type: '',
    rating: 0,
    title: '',
    description: '',
    email: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ type: 'success', message: 'Thank you for your feedback! We appreciate your input.' });
    setFormData({ type: '', rating: 0, title: '', description: '', email: '' });
    setTimeout(() => setStatus({ type: '', message: '' }), 5000);
  };

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
          <div className="max-w-6xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6"
            >
              Your Voice Matters
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
            >
              Share Your <span className="text-gradient">Feedback</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Help us improve by sharing your suggestions, reporting issues, or requesting new features
            </motion.p>
          </div>
        </section>

        {/* Feedback Form */}
        <section className="py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8"
            >
              {status.message && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl mb-6 ${
                    status.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {status.message}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium mb-4">Type of Feedback</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {feedbackTypes.map((type) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: type.id })}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl text-center transition-all ${
                          formData.type === type.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <span className="text-2xl block mb-2">{type.icon}</span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium mb-4">Overall Experience</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-3xl"
                      >
                        {star <= formData.rating ? '⭐' : '☆'}
                      </motion.button>
                    ))}
                    {formData.rating > 0 && (
                      <span className="ml-4 text-sm text-muted-foreground">
                        {ratingLabels[formData.rating - 1]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Brief summary of your feedback"
                    className="input-field w-full"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Please provide as much detail as possible..."
                    className="input-field w-full resize-none"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email (optional)
                    <span className="text-muted-foreground font-normal ml-2">for follow-up</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="input-field w-full"
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit Feedback
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </motion.div>
  );
}
