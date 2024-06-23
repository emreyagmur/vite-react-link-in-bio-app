import AuthContext from "@/context/JWTAuthContext";
import { useContext } from "react";

const useAuth = () => useContext(AuthContext);

export default useAuth;
