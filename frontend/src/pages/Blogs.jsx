import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const categories = ['All', 'Academic', 'Campus Life', 'Achievements', 'Placements', 'Events'];

const blogs = [
  {
    id: 1,
    title: 'Top 10 Tips for Academic Excellence',
    excerpt: 'Discover proven strategies to boost your academic performance and achieve your goals.',
    fullContent: 'Academic excellence requires a combination of smart study techniques, time management, and consistent effort. Start by creating a structured study schedule that allocates specific time slots for each subject. Use active learning techniques such as summarizing notes, teaching concepts to peers, and solving practice problems. Take regular breaks using the Pomodoro technique - 25 minutes of focused study followed by 5-minute breaks. Prioritize sleep and physical exercise as they significantly impact cognitive function. Join study groups for collaborative learning and use university resources like tutoring centers and office hours. Set SMART goals and track your progress regularly.',
    category: 'Academic',
    author: 'Dr. Sarah Johnson',
    date: 'Jan 15, 2024',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600',
    tags: ['Study Tips', 'Success', 'Learning'],
  },
  {
    id: 2,
    title: 'Student Wins National Coding Competition',
    excerpt: 'Our CS student brings home the gold medal from the prestigious national coding championship.',
    fullContent: 'Third-year Computer Science student Arjun Patel has won the gold medal at the National Coding Championship 2024, competing against over 5,000 participants from across the country. The competition consisted of three rounds: an online qualifier, a regional semi-final, and the national finals held at IIT Bombay. Arjun solved all 8 algorithmic challenges in the final round with a perfect score. He credits his success to consistent practice on competitive programming platforms, guidance from Prof. Meera Sharma, and participation in the university coding club. Arjun has been offered internship positions at Google, Microsoft, and Amazon.',
    category: 'Achievements',
    author: 'Campus News',
    date: 'Jan 12, 2024',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600',
    tags: ['Achievement', 'Coding', 'Competition'],
  },
  {
    id: 3,
    title: 'Annual Tech Fest Highlights',
    excerpt: 'Relive the best moments from this year\'s technology festival featuring innovation and creativity.',
    fullContent: 'TechFest 2024 was a resounding success with over 10,000 participants from 150 colleges attending the three-day extravaganza. Highlights included the robotics competition where autonomous drones navigated obstacle courses, the hackathon that produced innovative solutions for urban mobility challenges, and the AI art exhibition showcasing machine-generated artworks. Guest speakers included industry leaders from Tesla, OpenAI, and ISRO. The startup pitch competition saw 50 teams compete for ₹10 lakhs in seed funding. Cultural performances, gaming tournaments, and networking sessions rounded out the event. Planning for TechFest 2025 begins next month.',
    category: 'Events',
    author: 'Event Committee',
    date: 'Jan 10, 2024',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
    tags: ['Tech Fest', 'Innovation', 'Events'],
  },
  {
    id: 4,
    title: 'Placement Season 2024: Record Breaking Year',
    excerpt: 'Over 500 students placed with top companies with highest package reaching 45 LPA.',
    fullContent: 'The 2024 placement season has concluded with record-breaking results. A total of 523 students received job offers from 85 companies, achieving a placement rate of 92%. The highest package of ₹45 LPA was offered by Google to a Computer Science graduate, while the average package rose to ₹12.5 LPA, a 20% increase from last year. Top recruiters included Microsoft, Amazon, Goldman Sachs, Deloitte, and Infosys. The training and placement cell organized over 50 pre-placement workshops covering aptitude, technical skills, and interview preparation. Internship-to-PPO conversions accounted for 30% of total offers. The success is attributed to enhanced curriculum, industry partnerships, and dedicated career counseling.',
    category: 'Placements',
    author: 'Placement Cell',
    date: 'Jan 8, 2024',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600',
    tags: ['Placements', 'Career', 'Jobs'],
  },
  {
    id: 5,
    title: 'New Research Lab Inauguration',
    excerpt: 'State-of-the-art AI and Machine Learning research facility opens its doors to students.',
    fullContent: 'The new Center for Artificial Intelligence and Machine Learning (CAIML) was inaugurated by the Minister of Science and Technology. The ₹25 crore facility spans 15,000 square feet and houses cutting-edge computing infrastructure including NVIDIA DGX servers, quantum computing simulators, and specialized hardware for neural network training. The lab will support research in natural language processing, computer vision, reinforcement learning, and ethical AI. Twenty doctoral and fifty masters students will have access to the facility. Industry partners including IBM, Intel, and TCS have committed to collaborative research projects. The center will also offer certification courses for working professionals.',
    category: 'Campus Life',
    author: 'Admin Office',
    date: 'Jan 5, 2024',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
    tags: ['AI', 'Research', 'Infrastructure'],
  },
  {
    id: 6,
    title: 'Effective Study Techniques for Exams',
    excerpt: 'Learn the science-backed methods to prepare for your semester examinations effectively.',
    fullContent: 'Examination preparation requires strategic planning and evidence-based study techniques. Begin your preparation at least 4-6 weeks before exams. Use spaced repetition to reinforce memory - review material at increasing intervals (1 day, 3 days, 1 week, 2 weeks). Practice retrieval by testing yourself without looking at notes. Create mind maps for complex topics to visualize relationships between concepts. Solve previous year question papers under timed conditions. Form study groups for subjects that benefit from discussion. Maintain a healthy routine with 7-8 hours of sleep, regular meals, and short exercise breaks. Avoid last-minute cramming as it increases stress and reduces retention. Use the university counseling center if you experience exam anxiety.',
    category: 'Academic',
    author: 'Prof. Michael Chen',
    date: 'Jan 3, 2024',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600',
    tags: ['Exams', 'Study Tips', 'Success'],
  },
];

// Floating ambient icons for blogs page
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

function BlogCard({ blog, index, isExpanded, onToggle }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4, boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.1)' }}
      className="glass-card overflow-hidden group h-full flex flex-col"
    >
      <div className="aspect-video overflow-hidden">
        <motion.img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium mb-3 w-fit">
          {blog.category}
        </span>
        <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {blog.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {blog.excerpt}
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
              <div className="border-t border-border/50 pt-4 mb-4">
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {blog.fullContent}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/30">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{blog.author}</span>
            <span>•</span>
            <span>{blog.date}</span>
          </div>
          <span>{blog.readTime}</span>
        </div>
        
        <motion.button
          onClick={onToggle}
          className="mt-4 w-full py-2.5 rounded-lg bg-muted hover:bg-primary/10 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {isExpanded ? 'Show Less' : 'Read Full Article'}
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            ↓
          </motion.span>
        </motion.button>
      </div>
    </motion.article>
  );
}

export default function Blogs() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedBlog, setExpandedBlog] = useState(null);

  const filteredBlogs = activeCategory === 'All' 
    ? blogs 
    : blogs.filter(blog => blog.category === activeCategory);

  const toggleExpand = (id) => {
    setExpandedBlog(expandedBlog === id ? null : id);
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
        <FloatingIcon delay={0} duration={14}>📝</FloatingIcon>
        <FloatingIcon delay={2} duration={12}>📚</FloatingIcon>
        <FloatingIcon delay={4} duration={16}>✏️</FloatingIcon>
        <FloatingIcon delay={6} duration={13}>💡</FloatingIcon>
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
              Campus Blogs
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
            >
              Stories & <span className="text-gradient">Insights </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Educational blogs, campus updates, and student achievements
            </motion.p>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => {
                    setActiveCategory(category);
                    setExpandedBlog(null);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-5 py-2 rounded-full font-medium transition-all ${
                    activeCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="wait">
                {filteredBlogs.map((blog, index) => (
                  <BlogCard
                    key={blog.id}
                    blog={blog}
                    index={index}
                    isExpanded={expandedBlog === blog.id}
                    onToggle={() => toggleExpand(blog.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
    </motion.div>
  );
}