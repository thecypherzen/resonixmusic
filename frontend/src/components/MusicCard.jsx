import { useEffect } from "react";
import { cn } from "../lib/utils";

function MusicCard({ variant = "default", bgImageUrl, children, className }) {
  useEffect(() => {
    console.log("\n\nBGIMAGEURL:", bgImageUrl);
  }, [bgImageUrl]);
  switch (variant) {
    case "default":
    case "overlay":
      return (
        <div
          className={cn(
            "relative h-full w-full overflow-hidden p-3 group",
            className
          )}
        >
          <div
            className="h-full w-full absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-300 ease-in"
            style={{
              backgroundImage: `url(${bgImageUrl || "/thumbnail.png"})`,
            }}
          >
            <div className="absolute inset-0 bg-neutral-600/80 mix-blend-multiply"></div>
            <div className="h-full w-full absolute inset-0 p-2 pb-5 flex items-end">
              {children}
            </div>
          </div>
        </div>
      );
    case "boxed":
      return (
        <div
          className={cn(
            "w-full h-full flex flex-col gap-2 items-start p-2 rounded-md",
            className
          )}
        >
          <div
            className="img-container overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat w-full h-2/3"
            style={{
              backgroundImage: `url(${bgImageUrl || "/thumbnail.png"})`,
            }}
          ></div>
          <div className="flex flex-col text-left">{children}</div>
        </div>
      );
  }
}

export default MusicCard;
