import { BrowserRouter } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Routes from './routes';
import { AuthProvider } from './context/AuthContext';

const CURRENT_DATE = '2025-01-24 23:33:14';
const CURRENT_USER = 'gabrielisaacs';

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