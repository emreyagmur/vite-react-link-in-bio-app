import { combineReducers } from "redux";
import { authReducer } from "@/pages/auth/_store/auth";
import { userLinksReducer } from "@/pages/link/_store/link";

const RootReducer = combineReducers({
  auth: authReducer,
  userLinks: userLinksReducer,
});

export default RootReducer;
