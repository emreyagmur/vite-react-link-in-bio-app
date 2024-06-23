import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { navbarLinks } from "./NavbarLinks";

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="mt-5 flex px-2 space-y-1 flex-col">
          {navbarLinks.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="group flex items-center px-2 py-2 font-medium rounded-md"
            >
              {item.name}
            </a>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
