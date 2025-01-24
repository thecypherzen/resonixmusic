import { Routes, Route } from 'react-router-dom';
import WelcomeScreen from '../pages/WelcomeScreen';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import MusicPlayer from '../pages/MusicPlayer';
import SongDetailsPage from '../pages/SongDetailsPage';
import PlaylistDetails from '../components/PlaylistDetails';
import AlbumDetailsPage from '../pages/AlbumDetailsPage';
import ArtistPage from '../pages/ArtistPage';
import ProtectedRoute from '../components/ProtectedRoute';
import CreatePlaylist from '../components/CreatePlaylist'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MusicPlayer />} />
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/music" element={<MusicPlayer />} />
      <Route path="/song/:id" element={<SongDetailsPage />} />
      <Route path="/playlist/:id" element={<PlaylistDetails />} />
      <Route path="/album/:id" element={<AlbumDetailsPage />} />
      <Route path="/artist/:id" element={<ArtistPage />} />
      <Route
        path="/create-playlist"
        element={
          <ProtectedRoute>
            <CreatePlaylist />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
};

export default AppRoutes;