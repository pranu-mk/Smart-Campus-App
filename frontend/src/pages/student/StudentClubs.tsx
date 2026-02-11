import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, CheckCircle, LogOut, Loader2, AlertCircle } from "lucide-react";
import MainLayout from "@/components/layout/student/MainLayout";
import TopNavbar from "@/components/layout/student/TopNavbar";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { clubAPI } from "@/modules/student/services/api";

interface Club {
  id: string;
  name: string;
  description: string;
  members: number;
  joined: boolean;
  category: string;
  image: string;
  status: string; // Added to track database status
}

const categoryColors: Record<string, string> = {
  Technical: "#4f6fdc",
  Creative: "#f39c3d",
  Cultural: "#9333ea",
  Literary: "#0ea5e9",
  Sports: "#49b675",
  Business: "#f6c453",
  Social: "#ec4899",
  Other: "#6b7280"
};

const Clubs = () => {
  const { theme } = useTheme();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  // PHASE 1: Fetch Clubs from Database (with membership status)
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        const data = await clubAPI.getAll();
        
        const formattedClubs = data.map((item: any) => ({
          id: item.id.toString(),
          name: item.name,
          description: item.description,
          members: item.members_count || 0,
          category: item.category || "Other",
          image: item.image_emoji || "🏢",
          status: item.status || "active", // Syncing with DB status
          joined: item.is_member === 1 
        }));

        setClubs(formattedClubs);
      } catch (error: any) {
        console.error("Fetch error:", error);
        toast({
          title: "Connection Error",
          description: "Failed to load clubs. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // PHASE 2: Dynamic Join Logic with Inactive Guard
  const handleJoin = async (clubId: string, clubName: string) => {
    // Local guard to prevent API calls for inactive clubs
    const targetClub = clubs.find(c => c.id === clubId);
    if (targetClub?.status === 'inactive') {
      return toast({
        title: "Club Inactive",
        description: "Registration for this club is currently closed by administration.",
        variant: "destructive",
      });
    }

    try {
      await clubAPI.join(clubId);

      setClubs(prevClubs => prevClubs.map(club => 
        club.id === clubId ? { ...club, joined: true, members: club.members + 1 } : club
      ));

      toast({
        title: "Welcome aboard!",
        description: `You are now a member of ${clubName}.`,
      });
    } catch (error: any) {
      toast({
        title: "Join Failed",
        description: error.response?.data?.message || error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  // PHASE 4: Dynamic Exit Logic
  const handleLeave = async (clubId: string, clubName: string) => {
    try {
      await clubAPI.leave(clubId);

      setClubs(prevClubs => prevClubs.map(club => 
        club.id === clubId ? { ...club, joined: false, members: Math.max(0, club.members - 1) } : club
      ));

      toast({
        title: "Left Club",
        description: `You have successfully left ${clubName}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to leave the club.",
        variant: "destructive",
      });
    }
  };

  const getCardClasses = () => {
    switch (theme) {
      case "dark": return "bg-[#1a1a2e]";
      case "fancy": return "bg-gradient-to-br from-[#16213e] to-[#1a1a2e] border border-[#4f6fdc]/20";
      default: return "bg-white shadow-card";
    }
  };

  const myClubs = clubs.filter(c => c.joined);

  return (
    <MainLayout>
      <TopNavbar title="Student Clubs" subtitle="Explore interests and manage your memberships" />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-60">
          <Loader2 className="w-10 h-10 animate-spin text-[#4f6fdc] mb-4" />
          <p>Connecting to campus database...</p>
        </div>
      ) : (
        <>
          {myClubs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className={`text-lg font-semibold mb-4 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                My Clubs
              </h2>
              <div className="flex flex-wrap gap-3">
                {myClubs.map((club) => (
                  <div
                    key={`my-${club.id}`}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-sm border ${
                      theme === "light" ? "bg-white border-gray-100" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <span className="text-xl">{club.image}</span>
                    <span className={`text-sm font-medium ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                      {club.name}
                    </span>
                    <button 
                      onClick={() => handleLeave(club.id, club.name)}
                      className="ml-2 p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-all hover:scale-110"
                      title="Leave Club"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club, index) => (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`rounded-2xl overflow-hidden hover:shadow-card-hover transition-shadow flex flex-col ${getCardClasses()} ${club.status === 'inactive' ? 'opacity-80' : ''}`}
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                      theme === "light" ? "bg-gray-100" : "bg-white/10"
                    }`}>
                      {club.image}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${categoryColors[club.category] || "#6b7280"}15`, 
                          color: categoryColors[club.category] || "#6b7280" 
                        }}
                      >
                        {club.category}
                      </span>
                      {/* Inactive Status Flag */}
                      {club.status === 'inactive' && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-tight">
                          <AlertCircle className="w-2.5 h-2.5" /> Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className={`text-lg font-semibold mb-2 ${theme === "light" ? "text-[#1f2937]" : "text-white"}`}>
                    {club.name}
                  </h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                    {club.description}
                  </p>

                  <div className={`flex items-center gap-4 text-sm mb-6 ${theme === "light" ? "text-[#6b7280]" : "text-white/60"}`}>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {club.members} members
                    </span>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {club.joined ? (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 bg-green-500/10 text-green-500 cursor-default border border-green-500/20"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Member
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoin(club.id, club.name)}
                      disabled={club.status === 'inactive'} // Logical Guard
                      className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                        club.status === 'inactive' 
                          ? "bg-gray-500/20 text-gray-500 cursor-not-allowed grayscale" 
                          : theme === "fancy"
                            ? "bg-gradient-to-r from-[#4f6fdc] to-[#9333ea] text-white"
                            : "bg-[#4f6fdc] text-white hover:bg-[#4560c7]"
                      }`}
                    >
                      {club.status === 'inactive' ? (
                        <>Inactive</>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Join Club
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default Clubs;