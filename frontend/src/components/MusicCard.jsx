import { useEffect } from "react";
import { cn } from "../lib/utils";

function MusicCard({
  variant = "default",
  bgImageUrl,
  children,
  className,
  imageClassName,
}) {
  useEffect(() => {}, [bgImageUrl]);
  switch (variant) {
    case "default":
    case "overlay":
      return (
        <div
          className={cn(
            "relative h-full w-full overflow-hidden group rounded-lg",
            className,
          )}
        >
          <div
            className="h-full w-full absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-300 ease-in overfow-hidden rounded-lg"
            style={{
              backgroundImage: bgImageUrl
                ? `url(${bgImageUrl})`
                : "/thumbnail.png",
            }}
          >
            <div className="absolute inset-0 bg-neutral-200/50 mix-blend-multiply"></div>
            <div className="h-full w-full absolute inset-0 p-2 pb-4 flex items-end z-3">
              {children}
            </div>
            <div className="absolute left-0 bottom-0 h-3/5 w-full bg-linear-to-t from-background via-background/90 via-40% to-transparent z-2"></div>
          </div>
        </div>
      );
    case "boxed":
      return (
        <div
          className={cn(
            "w-full h-full flex flex-col gap-2 items-start p-2 rounded-md",
            className,
          )}
        >
          <div
            className={cn(
              "img-container overflow-hidden rounded-lg bg-cover bg-top bg-no-repeat w-full h-2/3",
              imageClassName,
            )}
            style={{
              backgroundImage: bgImageUrl
                ? `url(${bgImageUrl})`
                : "/thumbnail.png",
            }}
          ></div>
          <div className="flex flex-col text-left">{children}</div>
        </div>
      );
  }
}

export default MusicCard;
