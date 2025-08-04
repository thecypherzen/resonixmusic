import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, House, Library, Compass, Plus, X } from "lucide-react";
import { FaPlay } from "react-icons/fa6";
import { usePlayer } from "../context/PlayerContext";
import AuthModal from "./AuthModal";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import UserMenu from "./UserMenu";
import { useIsMedia } from "../hooks/useIsMobile";
import { cn } from "../lib/utils";

// Create a new CreatePlaylistModal component
const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description });
    setTitle("");
    setDescription("");
  };

  if (!isOpen) return null;

  return (
    <div className="bg-black/60 flex items-center justify-center">
      <div className="bg-[#121212] w-[30rem] p-6 shadow-2xl border rounded-xl border-neutral-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Create playlist</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors bg-transparent"
          >
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Playlist title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pr-4 py-2 border-b bg-transparent border-neutral-700 focus:outline-none text-white placeholder-neutral-400 focus:border-neutral-400 transition-colors duration-200"
              required
            />
          </div>
          <div className="space-y-2">
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full pr-4 py-2 border-b bg-transparent border-neutral-700 focus:outline-none text-white placeholder-neutral-400 focus:border-neutral-400 transition-colors duration-200 resize-none h-24"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2 text-sm border border-neutral-700 rounded-full bg-transparent hover:bg-neutral-700 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 text-sm bg-[#08B2F0] rounded-full hover:bg-[#0999cf] transition-colors duration-200"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function SideBar() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [sideNav, setSideNav] = useState(null);
  const isMobileBreakpoint = useIsMedia(767);

  useEffect(() => {}, [isMobileBreakpoint]);

  // Avoid rendering sidebar on mobile
  if (isMobileBreakpoint) {
    return <></>;
  }
  // Return the sidebar component when not on mobile
  return (
    <>
      <div className="py-8 flex flex-col gap-6 h-screen bg-[#212124] bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-30">
        {/* Navbar */}
        <SideBarNav isMobileBreakpoint={isMobileBreakpoint} />
        {/* Content */}
        <SideBarContent />
        {/* Modals */}
      </div>
    </>
  );
}

function SideBarNav({ isMobileBreakpoint, className }) {
  useEffect(() => {}, [isMobileBreakpoint]);
  return (
    <div
      id="sticky-nav-header"
      className={cn(
        "px-8 flex gap-2 items-center justify-between backdrop-blur-3xl bg-opacity-50 w-full shadow-lg shadow-neural-950/10 pb-6",
        className
      )}
    >
      {/* Profile */}
      <img
        src="/logo-grad.png"
        alt="resonix logo"
        className="h-auto w-1/3 min-w-[100px] max-w-[150px]"
      />
      <UserMenu />
    </div>
  );
}

function SideBarContent() {
  const [playlists, setPlaylists] = useState([]);
  //const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  //const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const userLogin = "gabrielisaacs";
  const initials = userLogin.substring(0, 2).toUpperCase();
  const { play } = usePlayer();

  const handleCreatePlaylistClick = () => {
    if (isAuthenticated) {
      setIsCreateModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleCreatePlaylist = (playlistData) => {
    const newPlaylist = {
      title: playlistData.title,
      description: playlistData.description,
      id: `playlist-${playlists.length + 1}`,
      tracks: [],
      createdAt: new Date().toISOString(),
      createdBy: userLogin,
    };
    setPlaylists([...playlists, newPlaylist]);
    setIsCreateModalOpen(false);
  };

  const handlePlayAllSongs = (playlist) => {
    if (playlist.tracks.length > 0) {
      play(playlist.tracks[0], playlist.tracks); // Play the first track and set the queue
    }
  };

  return (
    <div id="sidebar-content" className="space-y-3 overflow-y-auto">
      {/* Navigation Links */}
      <div className="px-8 flex flex-col gap-6 mt-2 ml-2 mt-4">
        <Link
          to="/"
          className={`inline-flex gap-2 text-white hover:text-[#08B2F0] text-base transition-colors duration-200 ${
            location.pathname === "/" ? "text-[#08B2F0]" : ""
          }`}
        >
          <House />
          <p>Home</p>
        </Link>
        <Link
          to="/explore"
          className={`inline-flex gap-2 text-white hover:text-[#08B2F0] text-base transition-colors duration-200 ${
            location.pathname === "/explore" ? "text-[#08B2F0]" : ""
          }`}
          onClick={(e) => e.preventDefault()}
        >
          <Compass />
          <p>Explore</p>
        </Link>
        <Link
          to="/playlist"
          className={`inline-flex gap-2 text-white hover:text-[#08B2F0] text-base transition-colors duration-200 ${
            location.pathname === "/trending" ? "text-[#08B2F0]" : ""
          }`}
          onClick={(e) => e.preventDefault()}
        >
          <Library />
          <p>Library</p>
        </Link>
      </div>

      {/* Playlists Section */}
      <div className="px-8 flex flex-col gap-4 my-6 text-[0.875rem] overflow-y-auto">
        <p className="text-white opacity-40 text-xs font-400 mt-4">
          MY PLAYLISTS
        </p>
        <div className="flex flex-col">
          <button
            onClick={handleCreatePlaylistClick}
            className="inline-flex items-center justify-center py-2 px-4 bg-transparent gap-1 hover:bg-[#212121] transition-all duration-200 rounded-full border border-neutral-700 w-full"
          >
            <Plus size={16} />
            <span className="text-xs">Create Playlist</span>
          </button>
          {playlists.length > 0 && (
            <div className="flex flex-col gap-6 bg-transparent hover:bg-white hover:bg-opacity-5 py-2 px-4 rounded-md mt-4">
              {playlists.map((playlist, index) => (
                <div
                  key={playlist.id}
                  className="group flex items-center justify-between transition-colors group"
                >
                  <Link
                    to={`/playlist/${playlist.id}`}
                    className="flex-grow hover:text-[#08B2F0] transition-colors duration-200"
                    onClick={(e) => e.preventDefault()}
                  >
                    {playlist.title}
                  </Link>
                  <button
                    onClick={() => handlePlayAllSongs(playlist)}
                    className="opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2 bg-transparent"
                  >
                    <FaPlay size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
{
  /* Modals */
}
{
  /*<CreatePlaylistModal
	isOpen={isCreateModalOpen}
	onClose={() => setIsCreateModalOpen(false)}
	onSubmit={handleCreatePlaylist}
/>

<AuthModal
	isOpen={isAuthModalOpen}
	onClose={() => setIsAuthModalOpen(false)}
/>*/
}
export default SideBar;
export { SideBarNav, SideBarContent };
