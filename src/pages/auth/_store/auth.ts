import { createSelector } from "reselect";
import objectPath from "object-path";
import { persistReducer } from "redux-persist";
import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import storage from "redux-persist/lib/storage";
import { IAction } from "@/store/store";
import { BASE_URL } from "@/store/apiUrl";

export type TPhase =
  | null
  | "loading"
  | "adding"
  | "updating"
  | "deleting"
  | "error"
  | "success";

export interface IResetPassword {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUserType {
  id: number;
  user_type_title: string;
}

export interface IUser {
  _id: string;
  username?: string;
  name?: string;
  email?: string;
  isActive?: string;
  profilePic?: string;
}

interface IAuthState {
  user?: IUser;
  accessToken?: string;
  userTheme?: string;
  lang?: string;
  error?: string;
  phase?: TPhase;
}

interface IParentAuthState {
  auth: IAuthState;
}

type TActionAllState = IAuthState & {
  id: number;
  userId: string;
  name: string;
  username: string;
  email: string;
  password: string;
  userPassword: IResetPassword;
  userInfo: Partial<IUser>;
};

export const actionTypes = {
  AUTH_LOGIN: "auth/LOGIN",
  SET_LOGIN_USER: "auth/SET_LOGIN",
  SET_PHASE: "auth/SET_PHASE",
  SET_THEME: "auth/SET_THEME",
  SET_CURRENCY: "auth/SET_CURRENCY",
  SET_LANG: "auth/SET_LANG",
  SET_ACTION_PHASE: "auth/SET_ACTION_PHASE",
  SET_REGISTER: "auth/SET_REGISTER",
  AUTH_LOGOUT: "auth/AUTH_LOGOUT",
  DELETE_USER: "auth/DELETE_USER",
  UPDATE_USER_PASSWORD: "auth/UPDATE_USER_PASSWORD",
  UPDATE_USER_PROFILE_PIC: "auth/UPDATE_USER_PROFILE_PIC",
  UPDATE_USER_INFO_IN_STORE: "auth/UPDATE_USER_INFO_IN_STORE",
  UPDATE_USER: "auth/UPDATE_USER",
};

export const initialAuthState: IAuthState = {
  user: null,
  accessToken: null,
  userTheme: "dark",
  lang: "en",
  phase: null,
  error: null,
};

export const authSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ["auth"]),
  (auth: IAuthState) => auth
);
export const authAccessTokenSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ["auth", "accessToken"]),
  (accessToken: string) => accessToken
);
export const authThemeSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ["auth", "userTheme"]),
  (userTheme: string) => userTheme
);

export const authLangSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ["auth", "lang"]),
  (lang: string) => lang
);
export const authUserSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ["auth", "user"]),
  (authUser: IUser) => authUser
);
export const authPhaseSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ["auth", "phase"]),
  (authPhase: string) => authPhase
);
export const authErrorSelector = createSelector(
  (state: IParentAuthState) => objectPath.get(state, ["auth", "error"]),
  (authError: string) => authError
);

export const authReducer = persistReducer(
  { storage: storage, key: "auth" },
  (
    state: IAuthState = initialAuthState,
    action: IAction<TActionAllState>
  ): IAuthState => {
    switch (action.type) {
      case actionTypes.AUTH_LOGIN: {
        return { ...state };
      }
      case actionTypes.SET_LOGIN_USER: {
        const { accessToken, user } = action.payload;
        return { ...state, accessToken, user };
      }
      case actionTypes.UPDATE_USER_INFO_IN_STORE: {
        const { user } = action.payload;
        return { ...state, user };
      }
      case actionTypes.AUTH_LOGOUT: {
        return {
          ...state,
          accessToken: null,
          phase: null,
          error: null,
          user: null,
        };
      }
      case actionTypes.SET_PHASE: {
        const { phase, error } = action.payload;
        return { ...state, phase, error };
      }
      case actionTypes.SET_THEME: {
        const { userTheme } = action.payload;
        return { ...state, userTheme };
      }

      case actionTypes.SET_LANG: {
        const { lang } = action.payload;
        return { ...state, lang };
      }
      default:
        return state;
    }
  }
);

export const authActions = {
  login: (email: string, password: string) => ({
    type: actionTypes.AUTH_LOGIN,
    payload: { email, password },
  }),
  setUserInfo: (user: IUser, accessToken: string) => ({
    type: actionTypes.SET_LOGIN_USER,
    payload: { user, accessToken },
  }),
  updateUser: (userInfo: Partial<IUser>) => ({
    type: actionTypes.UPDATE_USER,
    payload: { userInfo },
  }),
  updateProfilePic: (
    userInfo: Partial<IUser>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_PROFILE_PIC,
    payload: { userInfo },
  }),
  updateUserInfoInStore: (user: IUser) => ({
    type: actionTypes.UPDATE_USER_INFO_IN_STORE,
    payload: { user },
  }),
  deleteUser: (user: IUser) => ({
    type: actionTypes.DELETE_USER,
    payload: { user },
  }),
  updateUserPassword: (user: IUser, userPassword: IResetPassword) => ({
    type: actionTypes.UPDATE_USER_PASSWORD,
    payload: { user, userPassword },
  }),
  register: (
    name: string,
    username: string,
    email: string,
    password: string
  ) => ({
    type: actionTypes.SET_REGISTER,
    payload: { name, username, email, password },
  }),
  logout: () => ({
    type: actionTypes.AUTH_LOGOUT,
  }),
  setPhase: (phase: string, error: string) => ({
    type: actionTypes.SET_PHASE,
    payload: { phase, error },
  }),
  setTheme: (userTheme: string) => ({
    type: actionTypes.SET_THEME,
    payload: { userTheme },
  }),
  setLang: (lang: string) => ({
    type: actionTypes.SET_LANG,
    payload: { lang },
  }),
};

export function* saga() {
  yield takeLatest(
    actionTypes.AUTH_LOGIN,
    function* loginSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase("loading", null));
      const { email, password } = payload;
      const response = yield axios.post(`${BASE_URL}/login`, {
        email: email,
        password: password,
      });

      if (response.status !== 200) {
        yield put(
          authActions.setPhase(
            "error",
            response.data.message || "Network Error"
          )
        );
        return;
      }

      const { access_token, user } = response.data;

      yield put(authActions.setUserInfo(user, access_token));
      yield put(authActions.setPhase("success", null));
    }
  );

  yield takeLatest(
    actionTypes.SET_REGISTER,
    function* registerSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase("loading", null));

      const { name, username, email, password } = payload;
      const response = yield axios.post(`${BASE_URL}/register`, {
        name,
        username,
        email,
        password,
      });

      if (response === undefined) {
        yield put(authActions.setPhase("register-error", "Network Error"));
        return;
      } else if (response.status !== 200) {
        yield put(
          authActions.setPhase("register-error", response.data.message)
        );
        return;
      }

      const { access_token, user } = response.data;

      yield put(authActions.setUserInfo(user, access_token));
      yield put(authActions.setPhase("success", null));
    }
  );

  yield takeLatest(
    actionTypes.DELETE_USER,
    function* deleteUsesrSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase("user-deleting", null));

      const { user } = payload;

      const response = yield axios.post(`${BASE_URL}/deleteAccount`, {
        userId: user._id,
      });

      if (response.status !== 200) {
        yield put(authActions.setPhase("user-deleting-error", "API Error!!!"));
        return;
      } else {
        yield put(authActions.logout());
        yield put(authActions.setPhase("success", null));
      }
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_USER,
    function* updateUserSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase("user-updating", null));

      const { userInfo } = payload;

      const response = yield axios.post(`${BASE_URL}/user/update-user`, {
        userId: userInfo._id,
        username: userInfo.username,
        name: userInfo?.name,
        email: userInfo?.email,
      });

      if (response === undefined) {
        yield put(
          authActions.setPhase("user-updating-error", "Network Error!")
        );
        return;
      } else if (response.status !== 200) {
        yield put(
          authActions.setPhase("user-updating-error", response.data.message)
        );
        return;
      }

      const { userUpdate } = response.data;

      yield put(authActions.updateUserInfoInStore(userUpdate));
      yield put(authActions.setPhase("user-updating-success", null));
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_PROFILE_PIC,
    function* updateUserSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase("user-pic-updating", null));

      const { userInfo } = payload;

      const response = yield axios.post(
        `${BASE_URL}/update-profile-pic/${userInfo._id}`,
        {
          profile_pic: userInfo.profilePic,
        }
      );

      if (response === undefined) {
        yield put(authActions.setPhase("error", null));
        return;
      } else if (response.status !== 200) {
        yield put(authActions.setPhase("error", response.data.error));
        return;
      }

      const { userData } = response.data;

      yield put(authActions.updateUserInfoInStore(userData));
      yield put(authActions.setPhase("success", null));
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_PASSWORD,
    function* updateUserPasswordSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(authActions.setPhase("user-updating-password", null));

      const { user, userPassword } = payload;
      console.log(userPassword);

      const response = yield axios.post(`${BASE_URL}/updateUserPassword`, {
        userId: user._id,
        newPassword: userPassword,
      });

      if (response.data.error) {
        yield put(
          authActions.setPhase("user-updating-password-error", "API Error!!!")
        );
        return;
      } else {
        const { userData } = response.data;
        yield put(authActions.updateUserInfoInStore(userData));
        yield put(authActions.setPhase("user-updating-password-success", null));
      }
    }
  );
}
