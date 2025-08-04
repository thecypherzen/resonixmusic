import React from "react";
import { cn } from "../lib/utils";

const HeadingText = ({ text, className }) => {
  return (
    <p className={cn("text-xl md:text-3xl font-extrabold", className)}>
      {text}
    </p>
  );
};

export default HeadingText;
