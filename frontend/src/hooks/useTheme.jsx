import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "",
  setTheme: () => {},
});

const ThemeProvider = ({ children }) => {
  const themeKey = import.meta.env.VITE_THEME || "theme";
  const [theme, setTheme] = useState(localStorage.getItem(themeKey) || "dark");
  // Update theme in storage whenever it changes
  useEffect(() => {
    localStorage.setItem(themeKey, theme);
  }, [theme]);

  // toggleTheme function to switch between themes
  const toggleTheme = (themeName) => {
    if (themeName) {
      setTheme(themeName);
    } else {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { ThemeContext, ThemeProvider, useTheme };
