import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useAuth from "@/hooks/useAuth";
import { Home, Link2, Menu, User, LogIn, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const MobileMenu = () => {
  let { isAuthenticated } = useAuth();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className="mt-5 flex px-2 space-y-1 flex-col">
          {isAuthenticated ? (
            <>
              <Link
                to="/"
                className={
                  location.pathname === "/"
                    ? "group flex items-center px-2 py-2 font-medium rounded-md bg-muted hover:bg-opacity-75 cursor-pointer"
                    : "group flex items-center px-2 py-2 font-medium rounded-md hover:bg-muted hover:bg-opacity-75 cursor-pointer"
                }
              >
                <Home size={16} className="mr-2" />
                Home
              </Link>
              <Link
                to="/profile"
                className={
                  location.pathname === "/profile"
                    ? "group flex items-center px-2 py-2 font-medium rounded-md bg-muted hover:bg-opacity-75 cursor-pointer"
                    : "group flex items-center px-2 py-2 font-medium rounded-md hover:bg-muted hover:bg-opacity-75 cursor-pointer"
                }
              >
                <User size={16} className="mr-2" />
                Profile
              </Link>

              <Link
                to="/links"
                className={
                  location.pathname === "/links"
                    ? "group flex items-center px-2 py-2 font-medium rounded-md bg-muted hover:bg-opacity-75 cursor-pointer"
                    : "group flex items-center px-2 py-2 font-medium rounded-md hover:bg-muted hover:bg-opacity-75 cursor-pointer"
                }
              >
                <Link2 size={16} className="mr-2" />
                Links
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={
                  location.pathname === "/login"
                    ? "group flex items-center px-2 py-2 font-medium rounded-md bg-muted hover:bg-opacity-75 cursor-pointer"
                    : "group flex items-center px-2 py-2 font-medium rounded-md hover:bg-muted hover:bg-opacity-75 cursor-pointer"
                }
              >
                <LogIn size={16} className="mr-2" />
                Login
              </Link>
              <Link
                to="/register"
                className={
                  location.pathname === "/register"
                    ? "group flex items-center px-2 py-2 font-medium rounded-md bg-muted hover:bg-opacity-75 cursor-pointer"
                    : "group flex items-center px-2 py-2 font-medium rounded-md hover:bg-muted hover:bg-opacity-75 cursor-pointer"
                }
              >
                <UserPlus size={16} className="mr-2" />
                Register
              </Link>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
