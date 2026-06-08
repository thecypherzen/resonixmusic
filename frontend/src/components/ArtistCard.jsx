import { FaPlay } from "react-icons/fa";
import MusicCard from "./MusicCard";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useEffect } from "react";
import { UseRandomImages } from "@/hooks/UseRandomImages";

const ArtistCard = ({ artist, onClick, namespace = artists }) => {
  const { theme } = useTheme();
  const { imageGenerator, fetchRandomImage } = UseRandomImages();
  useEffect(() => {}, [imageGenerator]);
  useEffect(() => {
    console.log("ARTIST CARD FOR:\n\n", artist);
  }, []);

  return (
    <div
      onClick={() => onClick(artist)}
      className={cn(
        "flex flex-col bg-opacity-[2%] rounded-xl min-h-[16rem] gap-4 hover:border-none transition-all relative group hover:bg-opacity-5  w-full",
        theme === "dark"
          ? "bg-neutral-400/10"
          : "bg-gradient-to-b from-neutral-800 to-neutral-900",
      )}
      data-theme={theme}
    >
      {/* Play Button */}
      <div className="opacity-0 group-hover:opacity-100 group-active:opacity-100 flex bg-linear-to-r from-blue-500 to-purple-600 shadow-xl shadow-black/40 size-10 rounded-full absolute right-6 top-[7.5rem] hover:scale-110 active:scale-110 transition-all duration-300">
        <FaPlay className="m-auto fill-foreground" />
      </div>

      <MusicCard
        variant="boxed"
        bgImageUrl={
          artist.thumbnail
            ? artist.thumbnail
            : fetchRandomImage(namespace, artist.id)
        }
        className="w-full"
      >
        <div className="flex flex-col gap-1 justify-end">
          <p className="line-clamp-2 text-ellipsis w-full leading-tight font-medium text-lg mt-3">
            {artist.name}
          </p>
          <p className="text-sm text-neutral-400">
            <span>Since &nbsp;</span>
            <span>{artist.joinDate.split("-")[0]}</span>
          </p>
        </div>
      </MusicCard>
    </div>
  );
};

export default ArtistCard;
