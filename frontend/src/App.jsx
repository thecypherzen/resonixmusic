import { BrowserRouter } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Routes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./hooks/useTheme";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ThemeProvider>
            <PlayerProvider>
              <ScrollToTop />
              <Routes />
            </PlayerProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
