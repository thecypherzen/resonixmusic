import { button } from "framer-motion/client";
import React, { createContext, useContext } from "react";

const ContextMenuContext = createContext(null);

// ContextMenu
export function ContextMenu({ id, children }) {
  return (
    <ContextMenuContext.Provider value={{}} id={id}>
      <div className="context-menu">{children}</div>
    </ContextMenuContext.Provider>
  );
}

//Menu Trigger
export function ContextMenuTrigger({
  targetId,
  children,
  anchorName,
  className,
  ...rest
}) {
  return (
    <button
      popovertarget={`${targetId}`}
      className={className}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{ anchorName: `${anchorName}` }}
      {...rest}
    >
      {children}
    </button>
  );
}

// MenuItem
export function ContextMenuItem({ children, ...props }) {
  const context = useContext(ContextMenuContext);
  if (!!!context)
    throw new Error("ContextMenuItem must be used inside a ContextMenu");
  return <button {...props}>{children}</button>;
}
