import { BrowserRouter } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Routes from './routes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <PlayerProvider>
            <ScrollToTop />
            <Routes />
          </PlayerProvider>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;