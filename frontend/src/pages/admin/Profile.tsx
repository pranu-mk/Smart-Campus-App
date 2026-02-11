import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Shield, Settings, LogOut, X, Save, Key, Bell, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NeonCard } from '@/components/ui/NeonCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { GlowInput } from '@/components/ui/GlowInput';
import { NeonAvatar } from '@/components/ui/NeonAvatar';
import { useUI } from '@/context/admin/UIContext';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'https://smart-campus-backend-app.onrender.com/api';

export function ProfilePage() {
  const navigate = useNavigate();
  const { logout, addNotification } = useUI();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showSettingsLocalModal, setShowSettingsLocalModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const [profileSettings, setProfileSettings] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    notificationsEnabled: true,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // --- 1. FETCH LIVE ADMIN DATA ---
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_URL}/admin/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          const { full_name, email, mobile_number, department } = res.data.profile;
          setProfileSettings({
            name: full_name || 'System Administrator',
            email: email || '',
            phone: mobile_number || '',
            department: department || 'General Administration',
            notificationsEnabled: true,
          });
        }
      } catch (err) {
        toast({ title: "Error", description: "Failed to load profile data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- 2. UPDATE PROFILE INFORMATION ---
  const handleSaveSettings = async () => {
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`${API_URL}/admin/profile/update`, {
        full_name: profileSettings.name,
        mobile_number: profileSettings.phone
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        addNotification({
          title: 'Profile Updated',
          message: 'Your changes have been synced with the database',
          type: 'success',
        });
        setShowSettingsLocalModal(false);
      }
    } catch (err) {
      toast({ title: "Update Failed", description: "Could not save changes to database", variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  // --- 3. SECURE PASSWORD CHANGE ---
  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast({ title: "Validation Error", description: "Passwords do not match", variant: "destructive" });
    }
    setProcessing(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/profile/password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast({ title: "Success", description: "Password updated successfully" });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Password update failed", 
        variant: "destructive" 
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleLogout = () => {
    logout();
    addNotification({
      title: 'Logged Out',
      message: 'You have been successfully logged out',
      type: 'info',
    });
    setShowLogoutConfirm(false);
    navigate('/');
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="animate-spin text-neon-cyan w-10 h-10" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto text-left">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-orbitron gradient-text-aurora text-center">Admin Profile</h1>
      </motion.div>

      <NeonCard glowColor="purple">
        <div className="flex flex-col items-center text-center">
          <NeonAvatar initials={profileSettings.name.substring(0, 2).toUpperCase()} glowColor="purple" size="lg" />
          <h2 className="text-2xl font-bold text-foreground mt-4">{profileSettings.name}</h2>
          <p className="text-neon-cyan">{profileSettings.department}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-neon-green" />
            <span>Super Admin Access</span>
          </div>
        </div>
      </NeonCard>

      <NeonCard glowColor="cyan">
        <h3 className="font-bold text-foreground mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-neon-cyan" />
            <span className="text-foreground">{profileSettings.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-neon-purple" />
            <span className="text-foreground">{profileSettings.phone || 'Not Provided'}</span>
          </div>
        </div>
      </NeonCard>

      <div className="flex gap-4">
        <GlowButton 
          variant="cyan" 
          icon={<Settings className="w-4 h-4" />} 
          className="flex-1"
          onClick={() => setShowSettingsLocalModal(true)}
        >
          Settings
        </GlowButton>
        <GlowButton 
          variant="pink" 
          icon={<LogOut className="w-4 h-4" />}
          onClick={() => setShowLogoutConfirm(true)}
        >
          Logout
        </GlowButton>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsLocalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowSettingsLocalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass rounded-2xl neon-border overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
                <h2 className="text-xl font-bold font-orbitron text-foreground">Profile Settings</h2>
                <button onClick={() => setShowSettingsLocalModal(false)} className="p-2 hover:bg-muted/50 rounded-lg">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <GlowInput 
                  label="Full Name" 
                  value={profileSettings.name}
                  onChange={(e) => setProfileSettings({...profileSettings, name: e.target.value})}
                />
                <GlowInput 
                  label="Email (Read-only)" 
                  type="email"
                  value={profileSettings.email}
                  disabled
                />
                <GlowInput 
                  label="Phone" 
                  value={profileSettings.phone}
                  onChange={(e) => setProfileSettings({...profileSettings, phone: e.target.value})}
                />
                
                <label className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-neon-cyan" />
                    <span className="font-medium text-foreground text-sm">Email Notifications</span>
                  </div>
                  <button
                    onClick={() => setProfileSettings({...profileSettings, notificationsEnabled: !profileSettings.notificationsEnabled})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      profileSettings.notificationsEnabled ? 'bg-neon-cyan' : 'bg-muted'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      profileSettings.notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </label>

                <div className="p-4 rounded-lg bg-muted/30 border border-border/50 space-y-3">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-neon-purple" />
                    <span className="font-medium text-foreground text-sm">Security Update</span>
                  </div>
                  <GlowInput 
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                  <GlowInput 
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                  <GlowInput 
                    type="password"
                    placeholder="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                  <GlowButton variant="purple" size="sm" className="w-full" onClick={handleUpdatePassword} disabled={processing}>
                    {processing ? "Updating..." : "Update Password"}
                  </GlowButton>
                </div>

                <div className="flex gap-3 pt-4">
                  <GlowButton 
                    variant="gradient" 
                    className="flex-1"
                    icon={<Save className="w-4 h-4" />}
                    onClick={handleSaveSettings}
                    disabled={processing}
                  >
                    {processing ? "Saving..." : "Save Changes"}
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowSettingsLocalModal(false)}>
                    Cancel
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm glass rounded-2xl neon-border-pink overflow-hidden"
            >
              <div className="p-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-xl font-bold font-orbitron text-foreground">Confirm Logout</h2>
                <p className="text-muted-foreground">Are you sure you want to logout from the admin panel?</p>
                <div className="flex gap-3 pt-2">
                  <GlowButton 
                    variant="pink" 
                    className="flex-1"
                    onClick={handleLogout}
                  >
                    Yes, Logout
                  </GlowButton>
                  <GlowButton variant="purple" onClick={() => setShowLogoutConfirm(false)}>
                    Cancel
                  </GlowButton>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}