import UsePlayer from "@/hooks/UsePlayer";
import { formatDuration } from "@/lib/utils";
import { FaPlay, FaPause, FaDownload, FaClock } from "react-icons/fa";

export default function TracksList({ tracks = null }) {
  const { isPlaying, currentTrack, isLoading } = UsePlayer();

  if (!tracks || tracks.length === 0) {
    return <p className="text-center">No tracks available.</p>;
  }
  <div className="px-6 pb-36">
    <table className="w-full">
      <thead>
        <tr className="text-sm text-neutral-400 border-b border-neutral-800 transition-all duration-300">
          <th className="px-4 py-2 text-left w-12">#</th>
          <th className="px-4 py-2 text-left">Title</th>
          <th className="px-4 py-2 text-left">Plays</th>
          <th className="px-4 py-2 text-center">Download</th>
          <th className="px-4 py-2 text-right">
            <FaClock className="ml-auto mr-2.5" />
          </th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((track, index) => (
          <tr
            key={track.id}
            className="group hover:bg-neutral-800/50 rounded-lg transition-colors cursor-pointer"
            onClick={() => {}}
          >
            <td className="px-4 py-3 text-neutral-400 w-12">
              <div className="relative w-4">
                {isPlaying && currentTrack?.id === track.id ? (
                  <FaPause className="text-[#08B2F0]" />
                ) : (
                  <>
                    <span className="group-hover:hidden">{index + 1}</span>
                    <FaPlay className="hidden group-hover:block absolute -top-2 text-white" />
                  </>
                )}
              </div>
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={track.image}
                    alt={track.name}
                    className={`w-10 h-10 rounded ${
                      isLoading && currentTrack?.id === track.id
                        ? "opacity-50"
                        : ""
                    }`}
                  />
                  {isLoading && currentTrack?.id === track.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-normal ${
                      currentTrack?.id === track.id ? "text-[#08B2F0]" : ""
                    }`}
                  >
                    {track.name}
                  </span>
                  <span className="text-sm text-neutral-400">
                    {track.artist_name}
                  </span>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-neutral-400">{track.likes || 0}</td>
            <td className="px-4 py-3 text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadTrack(track);
                }}
                className="bg-transparent text-neutral-400 hover:text-[#08B2F0] transition-colors"
              >
                <FaDownload size={16} />
              </button>
            </td>
            <td className="px-4 py-3 text-right text-neutral-400">
              {formatDuration(track.duration)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>;
}
