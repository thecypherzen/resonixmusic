export default function DetailsPageHeader({ type, dataSet }) {
  return (
    <div className="flex items-end gap-6 p-6 h-[20rem] bg-transparent">
      <img
        src={dataSet.thumbnail ? dataSet.thumbnail : "/default_playlist.png"}
        alt={dataSet.title || "Playlist Thumbnail"}
        className="w-[10.75rem] h-[10.75rem] shadow-2xl rounded-lg"
      />
      <div className="flex flex-col gap-3">
        <span className="text-md font-bold">{capitalise(type)}</span>
        <h1 className="text-[5rem] font-bold leading-tight truncate max-w-full overflow-hidden whitespace-nowrap">
          {capitalise(dataSet.title)}
        </h1>
        <div className="flex items-center gap-2 text-md">
          <img
            src={dataSet.thumbnail}
            alt={dataSet.user_name}
            className="w-6 h-6 rounded-full"
          />
          <span className="font-bold hover:underline cursor-pointer">
            {dataSet.user_name}
          </span>
          <span className="text-neutral-400">
            {new Date(dataSet.creationDate).getFullYear()}
          </span>
          {dataSet && dataSet.tracks && (
            <span className="text-neutral-400">
              • {dataSet.tracks.length} songs
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
