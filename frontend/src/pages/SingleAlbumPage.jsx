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
    [selectedAlbum]
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

  if (isLoading) return <LoadingState />;
  if (error) return <div>{error?.message ?? "A loading error occured"}</div>;
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-3.5rem-26px)]">
      <div className="flex flex-col">
        <DetailsPageHeader
          type="album"
          dataSet={selectedAlbum}
          tracksCount={albumTracks.length ?? 0}
        />
        <TracksList tracks={albumTracks} />
      </div>
    </div>
  );
};

export default SingleAlbumPage;
