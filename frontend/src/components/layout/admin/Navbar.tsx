import { motion } from 'framer-motion';
import { Bell, Search, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import { useUI } from '@/context/admin/UIContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface NavbarProps {
  sidebarCollapsed: boolean;
}

export function Navbar({ sidebarCollapsed }: NavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const { setShowNotificationsDrawer, setShowSettingsModal } = useUI();
  
  // --- 1. DYNAMIC STATE ---
  const [adminInfo, setAdminInfo] = useState({
    name: 'Admin',
    role: 'Super Admin',
    avatar: ''
  });
  const [unreadCount, setUnreadCount] = useState(0);

  // --- 2. FETCH NAVBAR DATA ON MOUNT ---
  useEffect(() => {
    const fetchNavbarData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/admin/navbar/info`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setAdminInfo({
            name: res.data.admin.full_name,
            role: res.data.admin.role === 'admin' ? 'Super Admin' : 'Admin Staff',
            avatar: res.data.admin.profile_picture
          });
          setUnreadCount(res.data.unreadNotifications);
        }
      } catch (err) {
        console.error("Navbar sync error: Backend or Auth issue");
      }
    };

    fetchNavbarData();
    
    // Optional: Refresh count every 60 seconds for live updates
    const interval = setInterval(fetchNavbarData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed top-0 right-0 h-16 z-40 bg-slate-900/95 backdrop-blur-sm border-b border-neon-cyan/20 transition-all duration-300 ${
        sidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-lg">
          <motion.div
            className={`relative flex items-center ${
              searchFocused ? 'ring-2 ring-neon-cyan/30' : ''
            } rounded-lg transition-all duration-300`}
          >
            
          </motion.div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications - Dynamic Badge */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotificationsDrawer(true)}
            className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            
          </motion.button>

          

          {/* Divider */}
          <div className="w-px h-8 bg-border" />

          {/* Profile - Dynamic Info */}
          <Link to="/dashboard/admin/profile">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <NeonAvatar 
                initials={adminInfo.name.substring(0, 2).toUpperCase()} 
                url={adminInfo.avatar} 
                glowColor="purple" 
                size="sm" 
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-foreground">{adminInfo.name}</p>
                <p className="text-xs text-muted-foreground">{adminInfo.role}</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
    </motion.header>
  );
}