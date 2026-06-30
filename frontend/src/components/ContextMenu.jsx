import { cn } from "@/lib/utils";
import { button } from "framer-motion/client";
import React, { createContext, useContext } from "react";

const ContextMenuContext = createContext(null);

// ContextMenu
export function ContextMenu({ children }) {
  return (
    <ContextMenuContext.Provider value={{}}>
      <div className="context-menu">{children}</div>
    </ContextMenuContext.Provider>
  );
}

//Menu Trigger
export function ContextMenuTrigger({ target, children, className, ...rest }) {
  const context = useContext(ContextMenuContext);
  if (!!!context)
    throw new Error("ContextMenuTrigger must be used inside a ContextMenu");
  return (
    <button
      popovertarget={`${target}`}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{ anchorName: `--anchor-for-${target}` }}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ContextMenuContent({
  id,
  children,
  popover,
  className,
  ...props
}) {
  const context = useContext(ContextMenuContext);
  if (!!!context)
    throw new Error("ContextMenuContent must be used inside a ContextMenu");
  return (
    <aside
      id={id}
      {...props}
      popover={popover ?? "auto"}
      className={cn(
        "border border-foreground/20 text-foreground min-h-16 inset-auto m-0 rounded-md absolute content-center bg-neutral-900",
        className,
      )}
      style={{
        positionAnchor: `--anchor-for-${id}`,
        positionArea: "block-end span-inline-end",
        positionTryFallbacks: "flip-block, flip-inline, normal",
      }}
    >
      {children}
    </aside>
  );
}

// MenuItem
export function ContextMenuItem({ children, className, ...props }) {
  const context = useContext(ContextMenuContext);
  if (!!!context)
    throw new Error("ContextMenuItem must be used inside a ContextMenu");
  return (
    <button className={cn("py-2 px-5", className)} {...props}>
      {children}
    </button>
  );
}
