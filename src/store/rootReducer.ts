import { combineReducers } from "redux";
import { authReducer } from "@/pages/auth/_store/auth";
import { userLinksReducer } from "@/pages/link/_store/link";
import { userSettingReducer } from "@/pages/link/_store/user-setting";

const RootReducer = combineReducers({
  auth: authReducer,
  userLinks: userLinksReducer,
  userSetting: userSettingReducer,
});

export default RootReducer;
