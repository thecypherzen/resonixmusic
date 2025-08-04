import React from "react";
import { cn } from "../../lib/utils";

const ActionButton = ({ text, className, onClick }) => {
  return (
    <button
      className={cn(
        "bg-transparent hover:bg-[#212121] py-1 px-3 rounded-full border border-neutral-800 text-xs md:text-sm lg:text-md hover:bg-neutral-900 active:bg-neutral-950 transition-all duration-200",
        className
      )}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default ActionButton;
