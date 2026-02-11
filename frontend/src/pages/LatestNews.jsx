import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const newsItems = [
  {
    id: 1,
    title: 'New Academic Building Inauguration Ceremony',
    excerpt: 'The state-of-the-art academic building will be inaugurated next week by the Vice Chancellor.',
    fullContent: 'The new academic building features modern classrooms equipped with smart boards, a dedicated research wing, advanced laboratories for engineering and science students, and a rooftop solar panel installation. The inauguration ceremony will be attended by distinguished guests including the Governor, Education Minister, and alumni from across the country. Students and faculty are invited to attend the ceremony which will be followed by a guided tour of the facilities.',
    category: 'Administrative',
    date: 'Jan 18, 2024',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600',
  },
  {
    id: 2,
    title: 'Research Grant Awarded to Engineering Department',
    excerpt: 'The Department of Engineering has received a prestigious research grant for sustainable technology.',
    fullContent: 'The Engineering Department has been awarded a ₹2.5 crore research grant by the Department of Science and Technology for developing sustainable energy solutions. The three-year project will focus on creating affordable solar energy storage systems for rural areas. Professor Dr. Ramesh Kumar will lead the research team comprising 8 faculty members and 15 doctoral students. The grant also includes provisions for international collaboration with universities in Germany and Japan.',
    category: 'Academic',
    date: 'Jan 17, 2024',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600',
  },
  {
    id: 3,
    title: 'Students Excel at National Innovation Challenge',
    excerpt: 'Our students secured top positions in the National Innovation Challenge 2024.',
    fullContent: 'A team of five students from the Computer Science and Electronics departments won the first prize at the National Innovation Challenge 2024 held in New Delhi. Their project "SmartAgri" - an IoT-based precision farming solution - impressed the judges with its practical applicability and innovative use of machine learning. The team received a cash prize of ₹5 lakhs and an opportunity to incubate their startup at IIT Delhi. This marks the third consecutive year our institution has won a top prize at this prestigious competition.',
    category: 'Achievements',
    date: 'Jan 15, 2024',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600',
  },
  {
    id: 4,
    title: 'New Library Resources and Extended Hours',
    excerpt: 'The central library has added 5000+ new books and extended operating hours.',
    fullContent: 'The Central Library has undergone a major upgrade with the addition of over 5,000 new books, 200 international journals, and access to 15 new online databases. The library will now remain open until 11 PM on weekdays and 9 PM on weekends to accommodate students preparing for examinations. A new silent study zone with 100 seats has been created on the third floor. Additionally, the library has introduced a mobile app for book reservations, renewals, and accessing e-resources remotely.',
    category: 'Campus Update',
    date: 'Jan 14, 2024',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600',
  },
  {
    id: 5,
    title: 'Sports Complex Renovation Complete',
    excerpt: 'The newly renovated sports complex is now open with modern facilities.',
    fullContent: 'After 18 months of renovation work, the campus sports complex has reopened with world-class facilities. The complex now features an Olympic-size swimming pool, an indoor badminton court, a modern gymnasium with cardio and weight training equipment, and a yoga and meditation center. The outdoor facilities include a 400-meter synthetic track, a football field with FIFA-approved turf, and tennis courts with floodlights for evening play. Professional coaches have been hired for various sports, and students can avail coaching services at subsidized rates.',
    category: 'Campus Update',
    date: 'Jan 12, 2024',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600',
  },
  {
    id: 6,
    title: 'International Collaboration with Top Universities',
    excerpt: 'New MoUs signed with leading international universities for student exchange programs.',
    fullContent: 'The institution has signed Memorandums of Understanding with five prestigious universities - MIT (USA), Oxford (UK), TU Munich (Germany), NUS (Singapore), and University of Tokyo (Japan). These agreements enable student and faculty exchange programs, joint research initiatives, and dual degree programs. Starting next academic year, 50 students will have the opportunity to spend a semester abroad at partner institutions. The MoUs also include provisions for visiting faculty lectures, collaborative research funding, and access to shared research facilities.',
    category: 'Academic',
    date: 'Jan 10, 2024',
    image: 'https://imagine-public.x.ai/imagine-public/images/12cc44d6-d517-4e70-86e4-e8eb1ca35902.jpg?cache=1&dl=1',
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

function NewsCard({ news, index, isExpanded, onToggle, isFeatured = false }) {
  if (isFeatured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-video md:aspect-auto">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-4 w-fit">
              {news.category}
            </span>
            <h2 className="font-display font-bold text-2xl mb-4">{news.title}</h2>
            <p className="text-muted-foreground mb-4">{news.excerpt}</p>
            
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {news.fullContent}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">{news.date}</span>
              <motion.button
                onClick={onToggle}
                className="text-primary font-medium hover:underline flex items-center gap-1"
                whileHover={{ x: 4 }}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  →
                </motion.span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      whileHover={{ y: -4 }}
      className="glass-card overflow-hidden cursor-pointer group h-full"
    >
      <div className="aspect-video overflow-hidden">
        <motion.img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
          {news.category}
        </span>
        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {news.excerpt}
        </p>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {news.fullContent}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{news.date}</span>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="text-primary text-sm font-medium hover:underline"
            whileHover={{ x: 2 }}
          >
            {isExpanded ? 'Show Less ↑' : 'Read More →'}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
}

export default function LatestNews() {
  const [expandedNews, setExpandedNews] = useState(null);

  const toggleExpand = (id) => {
    setExpandedNews(expandedNews === id ? null : id);
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
        <FloatingIcon delay={0} duration={14}>📰</FloatingIcon>
        <FloatingIcon delay={2} duration={12}>📢</FloatingIcon>
        <FloatingIcon delay={4} duration={16}>🎓</FloatingIcon>
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
              Campus Updates
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
            >
              Latest <span className="text-gradient">News</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Stay informed with the latest campus news and administrative announcements
            </motion.p>
          </div>
        </section>

        {/* Featured News */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <NewsCard
              news={newsItems[0]}
              index={0}
              isExpanded={expandedNews === newsItems[0].id}
              onToggle={() => toggleExpand(newsItems[0].id)}
              isFeatured
            />
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.slice(1).map((news, index) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  index={index}
                  isExpanded={expandedNews === news.id}
                  onToggle={() => toggleExpand(news.id)}
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