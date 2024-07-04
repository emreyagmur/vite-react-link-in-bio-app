import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const ClientLayout = () => {
  return (
    <>
      <div className="flex flex-col mx-auto h-screen">
        <main className="flex-1 overflow-hidden h-full">
          <Outlet />
        </main>
        <footer className="my-5">
          <p className="text-center text-sm text-slate-500">
            Copyright © {new Date().getFullYear()} mylink.bio All rights
            reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default ClientLayout;
