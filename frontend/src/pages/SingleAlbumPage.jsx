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
  const { selectedAlbum, setSelectedAlbum, setSelectedTracks } = UseAppState();
  const {} = UsePlayer();
  console.log("\nID:", id);
  const { data: album, error } = useFetch({
    url: `/albums/tracks`,
    method: "get",
    extras: {
      params: {
        id: [id],
        image_size: 400,
        audio_format: "mp32",
      },
    },
  });

  useEffect(() => {
    if (id === null || id === undefined) return;

    setIsLoading(true); // Reset loading state when ID changes

    if (error) {
      console.error("Error loading album:", error);
      setIsLoading(false);
      return;
    }
    if (album) {
      console.log("New Album data received:", album[0]);
      const tab = transformAlbum(album[0]);
      setSelectedAlbum(tab);
      setSelectedTracks(tab.tracks);
      setIsLoading(false);
    }
  }, [id, album, error]);
  useEffect(() => {
    console.log("----> selectedAlbum.id: ", selectedAlbum?.id, "URL Id:", id);
  }, [selectedAlbum]);
  if (isLoading) return <LoadingState />;
  if (!isLoading && !selectedAlbum) return <div>Album not found</div>;
  return (
    <div className="flex-1 w-full min-h-[calc(100vh-3.5rem-26px)]">
      <div className="flex flex-col">
        <DetailsPageHeader type="album" dataSet={selectedAlbum} />
        <TracksList tracks={selectedAlbum.tracks.map(transformTrack)} />
      </div>
    </div>
  );
};

export default SingleAlbumPage;
