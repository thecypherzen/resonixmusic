import { useIsMedia } from "../../hooks/useIsMobile";

const SectionSkeleton = ({ cardsPerset = 5 }) => {
  const isSmall = useIsMedia(426);
  const isMedium = useIsMedia(768);

  useEffect(() => {}, [isSmall, isMedium]);

  return (
    <div className="animate-pulse flex flex-col">
      <div className="h-10 w-9/10 bg-neutral-800 rounded-2xl"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-[1rem]">
        {[...Array(isSmall ? 2 : isMedium ? 4 : cardsPerset)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-neutral-800 mb-4 rounded-3xl"
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SectionSkeleton;
