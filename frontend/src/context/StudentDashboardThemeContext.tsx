import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Theme = "light" | "dark" | "fancy";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const StudentDashboardThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const StudentDashboardThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('studentdashboard-theme') || 'light') as Theme;
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'fancy');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('studentdashboard-theme', theme);
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return (
    <StudentDashboardThemeContext.Provider value={{ theme, setTheme: handleSetTheme }}>
      {children}
    </StudentDashboardThemeContext.Provider>
  );
};

export const useStudentDashboardTheme = () => {
  const context = useContext(StudentDashboardThemeContext);
  if (!context) {
    throw new Error("useStudentDashboardTheme must be used within a StudentDashboardThemeProvider");
  }
  return context;
};
