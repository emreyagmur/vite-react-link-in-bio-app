import { Button } from "./ui/button";
import MobileMenu from "./MobileMenu";
import { ModeToggle } from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  let { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const redirectUrl = isAuthenticated ? "/dashboard" : "/";
  return (
    <nav className="fixed top-0 z-50 w-full flex md:grid md:grid-cols-12 items-center px-4 md:px-6 mx-auto py-3 border-b backdrop-blur">
      <div className="md:col-span-6">
        <a href={redirectUrl} className="hidden lg:block">
          <h1 className="text-xl font-semibold">
            mylink.<span className="text-primary">bio</span>
          </h1>
        </a>
        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </div>

      <div className="flex items-center gap-x-2 ms-auto md:col-span-6">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/logout")}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-x-2 ms-auto md:col-span-3">
            <Button>
              <Link to="login">Login</Link>
            </Button>
            <Button variant="secondary">
              <Link to="register">Register</Link>
            </Button>
          </div>
        )}

        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
