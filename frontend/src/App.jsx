import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Routes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./hooks/useTheme";
import { DownloadProvider } from "./hooks/UseDownload";
import { PlayerProvider } from "./hooks/UsePlayer";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <ThemeProvider>
            <DownloadProvider>
              <PlayerProvider>
                <ScrollToTop />
                <Routes />
              </PlayerProvider>
            </DownloadProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
