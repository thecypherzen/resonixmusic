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
};
