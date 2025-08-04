import { cn } from "../lib/utils";

function ImageBgOverlay({ className, imageUrl, children }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden p-3 group",
        className
      )}
    >
      <div
        className="h-full w-full absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-300 ease-in"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-neutral-600/80 mix-blend-multiply"></div>
        <div className="h-full w-full absolute inset-0 p-2 pb-5 flex items-end">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ImageBgOverlay;
