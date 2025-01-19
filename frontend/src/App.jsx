import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './pages/WelcomeScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import MusicPlayer from './pages/MusicPlayer';
import ErrorBoundary from './components/ErrorBoundary';
import { PlayerProvider } from './context/PlayerContext';
import SongDetailsPage from './pages/SongDetailsPage';
import AlbumDetailsPage from './pages/AlbumDetailsPage';

function App() {
  return (
    <Router>
      <PlayerProvider>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/music" element={<MusicPlayer />} />
            <Route path="/song/:id" element={<SongDetailsPage />} />
            <Route path="/album/:id" element={<AlbumDetailsPage />} />
          </Routes>
        </ErrorBoundary>
      </PlayerProvider>
    </Router>
  );
}

export default App;