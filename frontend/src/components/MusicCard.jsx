import { cn } from "../lib/utils";

function MusicCard({ variant = "default", ...props }) {
  switch (variant) {
    case "default":
    case "overlay":
      return (
        <div
          className={cn(
            "relative h-full w-full overflow-hidden p-3 group",
            props.className
          )}
        >
          <div
            className="h-full w-full absolute inset-0 bg-cover bg-center bg-no-repeat group-hover:scale-105 transition-transform duration-300 ease-in"
            style={{
              backgroundImage: `url(${props.imageUrl || "/thumbnail.png"})`,
            }}
          >
            <div className="absolute inset-0 bg-neutral-600/80 mix-blend-multiply"></div>
            <div className="h-full w-full absolute inset-0 p-2 pb-5 flex items-end">
              {props.children}
            </div>
          </div>
        </div>
      );
    case "boxed":
      return (
        <div
          className={cn(
            "w-full h-full flex flex-col gap-2 items-center p-2 border-1 border-red-400 rounded-md",
            props.className
          )}
        >
          <div
            className="img-container overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat w-full h-2/3"
            style={{
              backgroundImage: `url(${props.imageUrl || "/thumbnail.png"})`,
            }}
          >
            {/*<img
              src={props.imageUrl || "/thumbnail.png"}
              className="rounded-lg h-full w-full shadow-md object-cover object-center"
              loading="lazy"
            />*/}
          </div>
          <div className="flex flex-col text-left">{props.children}</div>
        </div>
      );
  }
}

export default MusicCard;
