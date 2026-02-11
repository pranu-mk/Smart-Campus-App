import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ComplaintPreview from '../components/ComplaintPreview';
import ServicesSection from '../components/ServicesSection';
import CampusInfo from '../components/CampusInfo';
import StatsSection from '../components/StatsSection';
import RolesSection from '../components/RolesSection';
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

export default function Index() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <Navbar />
      <HeroSection />
      <ComplaintPreview />
      <ServicesSection />
      <CampusInfo />
      <StatsSection />
      <RolesSection />
      <AboutSection />
      <Footer />
      <BackToTop />
    </motion.div>
  );
}
