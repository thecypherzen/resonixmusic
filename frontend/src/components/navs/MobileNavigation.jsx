import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { SideBarContent, SideBarNav } from "../SideBar";
import { useTheme } from "../../hooks/useTheme";

/**
 * @component
 * @name MobileNavigation
 * @description A mobile navigation component that provides a
 * responsive sidebar menu.
 * @returns {JSX.Element} The rendered mobile navigation component.
 */
function MobileNavigation() {
  const { theme } = useTheme();
  return (
    <Sheet className="bg-inherit" data-theme={theme}>
      <SheetTrigger>
        <div className="text-white p-0 rounded-md">
          <Menu size="28px" />
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        data-theme={theme}
        className="dark:bg-neutral-900 dark:text-neutral-200 flex flex-col gap-5 pt-8 pb-5 mt-0"
      >
        <SheetHeader className="shadow-lg shadow-black/15">
          <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Choose your options from the menu below
          </SheetDescription>
          <SideBarNav className="shadow-none pb-2 mt-2 px-3" />
        </SheetHeader>
        <SideBarContent />
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavigation;
