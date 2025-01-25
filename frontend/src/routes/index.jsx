import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WelcomeScreen from '../pages/WelcomeScreen';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import MusicPlayer from '../pages/MusicPlayer';
import SongDetailsPage from '../pages/SongDetailsPage';
import PlaylistDetails from '../components/PlaylistDetails';
import AlbumDetailsPage from '../pages/AlbumDetailsPage';
import ArtistPage from '../pages/ArtistPage';
import Profile from '../pages/Profile';
import ProtectedRoute from '../components/ProtectedRoute';
import CreatePlaylist from '../components/CreatePlaylist';

const CURRENT_DATE = '2025-01-24 23:57:34';
const CURRENT_USER = 'gabrielisaacs';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Authentication routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/welcome" element={<WelcomeScreen />} />

      {/* Public routes */}
      <Route path="/" element={<MusicPlayer />} />
      <Route path="/music" element={<MusicPlayer />} />
      <Route path="/song/:id" element={<SongDetailsPage />} />
      <Route path="/album/:id" element={<AlbumDetailsPage />} />
      <Route path="/artist/:id" element={<ArtistPage />} />
      <Route path="/playlist/:id" element={<PlaylistDetails />} />

      {/* Protected routes - only for playlist creation and user profile */}
      <Route
        path="/create-playlist"
        element={
          <ProtectedRoute>
            <CreatePlaylist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Redirect unmatched routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;