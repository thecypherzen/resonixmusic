import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import WelcomeScreen from "../pages/WelcomeScreen";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import MusicPlayer from "../pages/MusicPlayer";
import MusicPlayerLayout from "../components/layouts/MusicPlayerLayout";
import SongDetailsPage from "../pages/SongDetailsPage";
import AlbumDetailsPage from "../pages/AlbumDetailsPage";
import ArtistPage from "../pages/ArtistPage";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import CreatePlaylist from "../components/CreatePlaylist";
import AuthCallback from "../pages/AuthCallback";
import LoginSuccess from "../pages/LoginSuccess";
import ApiDocs from "../components/ApiDocs";
import ComingSoonPage from "../pages/ComingSoonPage";
import AppLayout from "../components/layouts/AppLayout";
import HomePage from "../pages/HomePage";
import SinglePlaylistPage from "@/pages/SinglePlaylistPage";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/profile" replace /> : <Login />
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/welcome" element={<WelcomeScreen />} />
      <Route path="/auth/success" element={<LoginSuccess />} />

      {/* Public routes */}
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<MusicPlayerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/music" element={<HomePage />} />
          <Route path="/song/:id" element={<SongDetailsPage />} />
          <Route path="/albums/:id" element={<AlbumDetailsPage />} />
          <Route path="/artists/:id" element={<ArtistPage />} />
          <Route path="/playlists/:id" element={<SinglePlaylistPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/docs" element={<ApiDocs />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
        </Route>
      </Route>

      <Route
        path="/create-playlist"
        element={<Navigate to="/coming-soon" replace />}
      />

      {/* Protected routes */}
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
