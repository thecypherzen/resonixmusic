import { cn } from "@/lib/utils";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/**
 * @func SectionDataNavigation - Handles navigation of section data.
 * Expects a setter, which is a state variable that returns a
 * *datapaginator* result
 * @param {*} param0
 * @returns
 */
export function SectionDataNavigation({ items, itemsSetter }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => itemsSetter(items.prev())}
        className={cn(
          "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
          items.currentPage == 1 &&
            "cursor-not-allowed hover:bg-transparent opacity-50",
        )}
        disabled={items.currentPage == 1}
      >
        <FaChevronLeft />
      </button>
      {/* Next btn */}
      <button
        onClick={() => itemsSetter(items.next())}
        className={cn(
          "p-2 rounded-full bg-transparent border border-neutral-800 hover:bg-neutral-800",
          items.currentPage == items.totalPages &&
            "cursor-not-allowed hover:bg-transparent opacity-50",
        )}
        disabled={items.currentPage == items.totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

/**
 * @func SectionErrorDisplay - Render section errors
 * @param {string} obj.reason - reason for the error
 * @returns
 */
export const SectionErrorDisplay = ({
  reason,
  prefix = null,
  message = null,
}) => {
  return (
    <div>
      <p className="text-neutral-500 flex flex-col gap-1 items-center justify-center p-5 bg-neutral-900 rounded-lg border-1 border-neutral-500">
        <span>
          {prefix ? prefix : ""}&nbsp;
          <span className="font-semibold text-neutral-400">{reason}</span>
        </span>
        {message && <span className="text-sm text-neutral-400">{message}</span>}
      </p>
    </div>
  );
};

export const LoadingState = ({ component = "default" }) => {
  if (component === "album-details") {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-900 p-6 animate-pulse">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col bg-neutral-900 p-6 animate-pulse">
            <div className="flex flex-col gap-4">
              <div className="w-20 h-6 bg-neutral-800 rounded"></div>
              <div className="w-96 h-24 bg-neutral-800 rounded"></div>
              <div className="w-64 h-6 bg-neutral-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (component === "artist-details") {
    return (
      <div className="flex mx-16 h-screen max-w-[60rem]">
        <div className="flex flex-col mt-[1.75rem] gap-[5rem]">
          {[...Array(3)].map((_, index) => (
            <SectionLoadingMessage key={index} />
          ))}
        </div>
      </div>
    );
  }
};

export const SectionLoadingMessage = () => (
  <div className="animate-pulse flex flex-col">
    <div className="h-10 w-[20rem] bg-neutral-800 rounded-2xl"></div>
    <div className="grid grid-cols-5 gap-4 mt-[1rem]">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-[11.5rem] h-[14rem] bg-neutral-800 mb-4 rounded-3xl"
        ></div>
      ))}
    </div>
  </div>
);

export const ErrorMessage = ({ message }) => (
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
