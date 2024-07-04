import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const AuthLayout = () => {
  let { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {isAuthenticated ? (
        navigate("/dashboard")
      ) : (
        <>
          <Navbar />
          <div className="flex flex-col h-screen mx-auto">
            <Outlet />
            <footer className="my-20">
              <p className="text-center text-sm text-slate-500">
                Copyright © {new Date().getFullYear()} mylink.bio All rights
                reserved.
              </p>
            </footer>
          </div>
        </>
      )}
    </>
  );
};

export default AuthLayout;
