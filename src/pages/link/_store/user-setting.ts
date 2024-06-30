import { createSelector } from "reselect";
import objectPath from "object-path";
import { persistReducer } from "redux-persist";
import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import storage from "redux-persist/lib/storage";
import { IAction } from "@/store/store";
import { BASE_URL } from "@/store/apiUrl";
import { IUser } from "@/pages/auth/_store/auth";

export interface IUserSetting {
  _id?: string;
  userId?: string;
  displayName?: string;
  description?: string;
  userAvatar?: string;
  backgroungPic?: string;
  backgroundColor?: string;
}

interface IUserSettingState {
  userSetting?: IUserSetting;
  phase?: string;
  error?: string;
}

type TActionAllState = IUserSettingState & {
  _id: string;
  user: IUser;
  userSettingInfo: Partial<IUserSetting>;
};

export const actionTypes = {
  PULL_USER_SETTING: "userSetting/PULL_USER_SETTING",
  SET_USER_SETTING: "userSetting/SET_USER_SETTING",
  ADD_USER_SETTING: "userSetting/ADD_USER_SETTING",
  UPDATE_USER_SETTING: "userSetting/UPDATE_USER_SETTING",
  SET_PHASE: "userSetting/SET_PHASE",
};

export const initialState: IUserSettingState = {
  userSetting: null,
  phase: null,
  error: null,
};

export const userSettingSelector = createSelector(
  (state: IUserSettingState) =>
    objectPath.get(state, ["userSetting", "userSetting"]),
  (userSetting: IUserSetting) => userSetting
);

export const userSettingPhaseSelector = createSelector(
  (state: IUserSettingState) => objectPath.get(state, ["userSetting", "phase"]),
  (phase: string) => phase
);

export const userSettingErrorSelector = createSelector(
  (state: IUserSettingState) => objectPath.get(state, ["userSetting", "error"]),
  (error: string) => error
);

export const userSettingReducer = persistReducer(
  { storage: storage, key: "userSetting" },
  (
    state: IUserSettingState = initialState,
    action: IAction<TActionAllState>
  ): IUserSettingState => {
    switch (action.type) {
      case actionTypes.SET_USER_SETTING: {
        const { userSetting } = action.payload;
        return { ...state, userSetting };
      }
      case actionTypes.SET_PHASE: {
        const { phase } = action.payload;
        return { ...state, phase };
      }
      default:
        return state;
    }
  }
);

export const userSettingActions = {
  pullUserSetting: (user: IUser): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_USER_SETTING,
    payload: { user },
  }),
  setUserSetting: (
    userSetting: IUserSetting
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_USER_SETTING,
    payload: { userSetting },
  }),
  addUserSetting: (
    userSettingInfo: Partial<IUserSetting>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_USER_SETTING,
    payload: { userSettingInfo },
  }),
  updateUserSetting: (
    userSettingInfo: Partial<IUserSetting>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_SETTING,
    payload: { userSettingInfo },
  }),
  setPhase: (
    phase: string,
    error: string
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase, error },
  }),
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_USER_SETTING,
    function* pullUserSettingSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userSettingActions.setPhase("loading", null));

      const { user } = payload;
      const response = yield axios.post(`${BASE_URL}/user-setting`, {
        userId: user._id,
      });

      if (response === undefined) {
        yield put(userSettingActions.setPhase("error", "Network Error"));
        return;
      } else if (response.status !== 200) {
        yield put(userSettingActions.setPhase("error", response.data.message));
        return;
      }

      const { userSetting } = response.data;

      yield put(userSettingActions.setUserSetting(userSetting));
      yield put(userSettingActions.setPhase("success", null));
    }
  );

  yield takeLatest(
    actionTypes.ADD_USER_SETTING,
    function* addUserSettingSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(
        userSettingActions.setPhase("user-setting-create-loading", null)
      );

      const { userSettingInfo } = payload;
      const response = yield axios.post(
        `${BASE_URL}/user-setting/create`,
        userSettingInfo
      );

      if (response === undefined) {
        yield put(
          userSettingActions.setPhase(
            "user-setting-create-error",
            "Network Error"
          )
        );
        return;
      } else if (response.status !== 200) {
        yield put(
          userSettingActions.setPhase(
            "user-setting-create-error",
            response.data.message
          )
        );
        return;
      }

      const { userSetting } = response.data;

      yield put(userSettingActions.setUserSetting(userSetting));
      yield put(
        userSettingActions.setPhase("user-setting-create-success", null)
      );
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_SETTING,
    function* updateUserSettingSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userSettingActions.setPhase("update-loading", null));

      const { userSettingInfo } = payload;
      const response = yield axios.post(
        `${BASE_URL}/user-setting/update`,
        userSettingInfo
      );

      if (response === undefined) {
        yield put(userSettingActions.setPhase("update-error", "Network Error"));
        return;
      } else if (response.status !== 200) {
        yield put(
          userSettingActions.setPhase("update-error", response.data.message)
        );
        return;
      }

      const { userSetting } = response.data;

      yield put(userSettingActions.setUserSetting(userSetting));
      yield put(userSettingActions.setPhase("update-success", null));
    }
  );
}
