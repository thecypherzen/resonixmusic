import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import Routes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./hooks/useTheme";
import { DownloadProvider } from "./hooks/UseDownload";
import { PlayerProvider } from "./hooks/UsePlayer";
import { AppStateProvider } from "./hooks/UseAppState";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppStateProvider>
            <ThemeProvider>
              <DownloadProvider>
                <PlayerProvider>
                  <ScrollToTop />
                  <Routes />
                </PlayerProvider>
              </DownloadProvider>
            </ThemeProvider>
          </AppStateProvider>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
