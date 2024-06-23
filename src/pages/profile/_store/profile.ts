import { createSelector } from "reselect";
import objectPath from "object-path";
import { persistReducer } from "redux-persist";
import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import storage from "redux-persist/lib/storage";
import { IAction } from "@/store/store";

const BASE_URL = "localhost";
export interface anySetting {
  id?: number;
  user_id?: number;
  user_image?: string;
  user_subtitle?: string;
  user_title?: string;
  bg_color?: string;
}

interface anySettingState {
  userSetting?: anySetting;
  phase?: string;
  error?: string;
}

type TActionAllState = anySettingState & {
  id: number;
  user: any;
  userSettingInfo: Partial<anySetting>;
};

export const actionTypes = {
  PULL_USER_SETTING: "userSetting/PULL_USER_SETTING",
  SET_USER_SETTING: "userSetting/SET_USER_SETTING",
  ADD_USER_SETTING: "userSetting/ADD_USER_SETTING",
  UPDATE_USER_SETTING: "userSetting/UPDATE_USER_SETTING",
  SET_PHASE: "userSetting/SET_PHASE",
};

export const initialState: anySettingState = {
  userSetting: null,
  phase: null,
  error: null,
};

export const userSettingSelector = createSelector(
  (state: anySettingState) =>
    objectPath.get(state, ["userSetting", "userSetting"]),
  (userSetting: anySetting) => userSetting
);

export const userSettingPhaseSelector = createSelector(
  (state: anySettingState) => objectPath.get(state, ["userSetting", "phase"]),
  (phase: string) => phase
);

export const userSettingErrorSelector = createSelector(
  (state: anySettingState) => objectPath.get(state, ["userSetting", "error"]),
  (error: string) => error
);

export const userSettingReducer = persistReducer(
  { storage: storage, key: "userSetting" },
  (
    state: anySettingState = initialState,
    action: IAction<TActionAllState>
  ): anySettingState => {
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
  pullUserSetting: (user: any): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_USER_SETTING,
    payload: { user },
  }),
  setUserSetting: (
    userSetting: anySetting
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_USER_SETTING,
    payload: { userSetting },
  }),
  addUserSetting: (
    userSettingInfo: Partial<anySetting>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_USER_SETTING,
    payload: { userSettingInfo },
  }),
  updateUserSetting: (
    id: number,
    userSettingInfo: Partial<anySetting>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_SETTING,
    payload: { id, userSettingInfo },
  }),
  setPhase: (phase: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_PHASE,
    payload: { phase },
  }),
};

export function* saga() {
  yield takeLatest(
    actionTypes.PULL_USER_SETTING,
    function* pullUserSettingSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userSettingActions.setPhase("loading"));

      const { user } = payload;
      const response = yield axios.get(
        `${BASE_URL}/get-user-setting/${user.id}`
      );

      if (response === undefined) {
        yield put(userSettingActions.setPhase("error"));
        return;
      } else if (response.status !== 200) {
        yield put(userSettingActions.setPhase("error"));
        return;
      }

      const { userSetting } = response.data;

      yield put(userSettingActions.setUserSetting(userSetting));
      yield put(userSettingActions.setPhase("success"));
    }
  );

  yield takeLatest(
    actionTypes.ADD_USER_SETTING,
    function* addUserSettingSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userSettingActions.setPhase("loading"));

      const { userSettingInfo, user } = payload;
      const response = yield axios.post(`${BASE_URL}/create-user-setting`, {
        user_id: userSettingInfo.user_id,
        user_image: userSettingInfo?.user_image,
        user_subtitle: userSettingInfo?.user_subtitle,
        user_title: userSettingInfo?.user_title,
        bg_color: userSettingInfo?.bg_color,
      });

      if (response === undefined) {
        yield put(userSettingActions.setPhase("error"));
        return;
      } else if (response.status !== 200) {
        yield put(userSettingActions.setPhase("error"));
        return;
      }

      const { userSetting } = response.data;

      yield put(userSettingActions.setUserSetting(userSetting));
      yield put(userSettingActions.setPhase("success"));
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_SETTING,
    function* updateUserSettingSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userSettingActions.setPhase("loading"));

      const { id, userSettingInfo } = payload;
      const response = yield axios.post(
        `${BASE_URL}/update-user-setting/${id}`,
        {
          user_image: userSettingInfo?.user_image,
          user_subtitle: userSettingInfo?.user_subtitle,
          user_title: userSettingInfo?.user_title,
          bg_color: userSettingInfo?.bg_color,
        }
      );

      if (response === undefined) {
        yield put(userSettingActions.setPhase("error"));
        return;
      } else if (response.status !== 200) {
        yield put(userSettingActions.setPhase("error"));
        return;
      }

      const { userSetting } = response.data;

      yield put(userSettingActions.setUserSetting(userSetting));
      yield put(userSettingActions.setPhase("success"));
    }
  );
}
