import Navbar from "./Navbar";
import { Card } from "./ui/card";
import { Copy, Home, User, Link2 } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { authUserSelector } from "@/pages/auth/_store/auth";
import { useSelector } from "react-redux";
import { useIdleTimer } from "react-idle-timer";

const IDLE_TIMEOUT = 1000 * 60 * 60; // 1 hour

const Layout = () => {
  let { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeUser = useSelector(authUserSelector);

  useIdleTimer({
    timeout: IDLE_TIMEOUT,
    onIdle: () => navigate("/logout"),

    debounce: 500,
  });

  return (
    <>
      {!isAuthenticated ? (
        navigate("/login")
      ) : (
        <>
          <Navbar />
          <div className="flex flex-row mx-auto mt-[65px]">
            <nav className="relative hidden w-[300px] border-r sidebar-h lg:block p-6 overflow-hidden">
              <div className="flex space-y-1 flex-col gap-3">
                <Card className="flex p-4 items-center justify-between ">
                  <p className="text-sm text-ellipsis overflow-hidden">
                    mylink.bio/{activeUser?.username}
                  </p>
                  <Copy
                    className="w-4 h-4 cursor-pointer hover:bg-muted"
                    onClick={() => console.log("test")}
                  />
                </Card>
                <Link
                  to="/dashboard"
                  className={
                    location.pathname === "/dashboard"
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
              </div>
            </nav>
            <main className="flex-1 overflow-y-auto sidebar-h">
              <div className="flex-1 space-y-4 p-6">
                <Outlet />
              </div>
            </main>
          </div>
        </>
      )}
    </>
  );
};

export default Layout;
