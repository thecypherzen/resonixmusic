import { BrowserRouter } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import Routes from './routes';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <PlayerProvider>
          <ScrollToTop />
          <Routes />
        </PlayerProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;