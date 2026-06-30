import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingState } from "./SinglePlaylistPage";
import { UseAppState } from "@/hooks/UseAppState";
import UsePlayer from "@/hooks/UsePlayer";
import { useFetch } from "@/hooks/useFetch";
import { transformAlbum, transformTrack } from "@/lib/utils";
import { DetailsPageHeader } from "@/components/DetailsPageHeader";
import TracksList from "@/components/TracksList";

const SingleAlbumPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    selectedAlbum,
    setSelectedAlbum,
    selectedTracks: albumTracks,
    setSelectedTracks: setAlbumTracks,
  } = UseAppState();
  const {} = UsePlayer();

  const { data: albumWithTracks, albumWithTracksErr } = useFetch({
    url: `/albums/tracks`,
    method: "get",
    extras: {
      params: {
        id: [id],
      },
    },
  });

  const { data: tracks, error: tracksError } = useFetch(
    {
      url: "/tracks",
      method: "get",
      extras: { params: { id: selectedAlbum?.tracks } },
    },
    !!!selectedAlbum,
    [selectedAlbum],
  );

  useEffect(() => {
    if (id === null || id === undefined) return;
    if (albumWithTracksErr) {
      console.error("Failed to fetch album with tracks:", albumWithTracksErr);
      setError(albumWithTracksErr);
      return;
    }
    if (albumWithTracks) {
      setSelectedAlbum(transformAlbum(albumWithTracks[0]));
    }
  }, [albumWithTracks]);

  useEffect(() => {
    if (selectedAlbum) {
      if (tracksError) {
        setError(tracksError);
        return;
      }
      if (tracks) {
        setAlbumTracks(tracks.map(transformTrack));
      }
    }
  }, [selectedAlbum, tracks]);

  useEffect(() => {
    if (albumTracks || error) {
      setIsLoading(false);
    }
  }, [albumTracks]);

  if (error) return <ErrorMessage message={error} />;
  if (!selectedAlbum) return <div>Album not found</div>;
  if (isLoading) return <LoadingState component="artist-details" />;

  return (
    <main className="flex flex-col flex-1 overflow-y-auto w-full ">
      <DetailsPageHeader
        dataSet={selectedAlbum}
        type="album"
        tracksCount={albumTracks?.length}
        namespace="albums"
      />
      {/* Tracks List */}
      <TracksList
        tracks={albumTracks}
        artistPerTrack={false}
        className="px-10"
      />
    </main>
  );
};

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center h-[75vh] w-[60rem] mx-16 fixed">
    <div className="text-neutral-600 flex flex-col items-center">
      <MdErrorOutline size={102} className="m-auto" />
      <p className="text-2xl mb-2 font-extrabold">Unable to load content</p>
      <p className="text-sm">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="text-sm mt-4 px-8 py-2 bg-transparent border rounded-full border-neutral-700 hover:bg-neutral-800 transition-all duration-200"
      >
        Retry
      </button>
    </div>
  </div>
);

export default SingleAlbumPage;
