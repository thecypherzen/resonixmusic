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

function MobileNavigation() {
  const { theme } = useTheme();
  return (
    <Sheet className="bg-inherit" data-theme={theme}>
      <SheetTrigger>
        <div className="text-white p-3 rounded-md">
          <Menu />
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        data-theme={theme}
        className="dark:bg-neutral-900 dark:text-neutral-200 flex flex-col gap-5 py-8"
      >
        <SheetHeader classnName="shadow-lg shadow black/15">
          <SheetDescription className="sr-only">
            Your mobile seft nav menu
          </SheetDescription>
          <SideBarNav />
        </SheetHeader>
        <SideBarContent />
      </SheetContent>
    </Sheet>
  );
}

export default MobileNavigation;
