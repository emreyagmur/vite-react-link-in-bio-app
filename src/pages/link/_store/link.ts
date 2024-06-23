import { createSelector } from "reselect";
import objectPath from "object-path";
import { persistReducer } from "redux-persist";
import { put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import storage from "redux-persist/lib/storage";
import { IAction } from "@/store/store";
import { BASE_URL } from "@/store/apiUrl";
import { IUser } from "@/pages/auth/_store/auth";
import { produce } from "immer";

export interface IUserLink {
  _id?: string;
  userId?: string;
  linkType?: string;
  title?: string;
  icon?: string;
  url?: string;
}

interface IUserLinkState {
  userLinks?: IUserLink[];
  phase?: string;
  error?: string;
}

type TActionAllState = IUserLinkState & {
  _id: string;
  user: IUser;
  userLink: IUserLink;
  userLinkInfo: Partial<IUserLink>;
};

export const actionTypes = {
  PULL_USER_LINKS: "userLinks/PULL_USER_LINKS",
  SET_USER_LINKS: "userLinks/SET_USER_LINKS",
  ADD_USER_LINK: "userLinks/ADD_USER_LINK",
  UPDATE_USER_LINK: "userLinks/UPDATE_USER_LINKS",
  DELETE_USER_LINK: "userLinks/DELETE_USER_LINK",
  REMOVE_USER_LINK: "userLinks/REMOVE_USER_LINK",
  SET_USER_LINK: "userLinks/SET_USER_LINK",
  SET_PHASE: "userLinks/SET_PHASE",
};

export const initialState: IUserLinkState = {
  userLinks: [],
  phase: null,
  error: null,
};

export const userLinksSelector = createSelector(
  (state: IUserLinkState) => objectPath.get(state, ["userLinks", "userLinks"]),
  (userLinks: IUserLink[]) => userLinks
);

export const userLinksPhaseSelector = createSelector(
  (state: IUserLinkState) => objectPath.get(state, ["userLinks", "phase"]),
  (phase: string) => phase
);

export const userLinksErrorSelector = createSelector(
  (state: IUserLinkState) => objectPath.get(state, ["userLinks", "error"]),
  (error: string) => error
);

export const userLinksReducer = persistReducer(
  { storage: storage, key: "userLinks" },
  (
    state: IUserLinkState = initialState,
    action: IAction<TActionAllState>
  ): IUserLinkState => {
    switch (action.type) {
      case actionTypes.SET_USER_LINKS: {
        const { userLinks } = action.payload;
        return { ...state, userLinks };
      }
      case actionTypes.SET_USER_LINK: {
        const { userLink } = action.payload;
        return produce(state, (draftState) => {
          const index = draftState.userLinks.findIndex(
            (d) => d._id === userLink._id
          );
          if (index > -1) {
            draftState.userLinks[index] = userLink;
          } else {
            draftState.userLinks.unshift(userLink);
          }
        });
      }
      case actionTypes.REMOVE_USER_LINK: {
        const { _id } = action.payload;
        const userLinks = { ...state }.userLinks.filter((d) => d._id !== _id);
        return { ...state, userLinks };
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

export const userLinksActions = {
  pullUserLinks: (user: IUser): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.PULL_USER_LINKS,
    payload: { user },
  }),
  setUserLinks: (
    userLinks: IUserLink[]
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_USER_LINKS,
    payload: { userLinks },
  }),
  addUserLink: (
    userLinkInfo: Partial<IUserLink>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.ADD_USER_LINK,
    payload: { userLinkInfo },
  }),
  updateUserLink: (
    userLinkInfo: Partial<IUserLink>
  ): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.UPDATE_USER_LINK,
    payload: { userLinkInfo },
  }),
  deleteUserLink: (_id: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.DELETE_USER_LINK,
    payload: { _id },
  }),
  removeUserLink: (_id: string): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.REMOVE_USER_LINK,
    payload: { _id },
  }),
  setUserLink: (userLink: IUserLink): IAction<Partial<TActionAllState>> => ({
    type: actionTypes.SET_USER_LINK,
    payload: { userLink },
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
    actionTypes.PULL_USER_LINKS,
    function* pullUserLinksSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userLinksActions.setPhase("loading", null));

      const { user } = payload;
      const response = yield axios.post(`${BASE_URL}/user-link`, {
        userId: user._id,
      });

      if (response === undefined) {
        yield put(userLinksActions.setPhase("error", "Network Error"));
        return;
      } else if (response.status !== 200) {
        yield put(userLinksActions.setPhase("error", response.data.message));
        return;
      }

      const { userLink } = response.data;

      yield put(userLinksActions.setUserLinks(userLink));
      yield put(userLinksActions.setPhase("success", null));
    }
  );

  yield takeLatest(
    actionTypes.ADD_USER_LINK,
    function* addUserLinkSaga({ payload }: IAction<Partial<TActionAllState>>) {
      yield put(userLinksActions.setPhase("user-link-create-loading", null));

      const { userLinkInfo } = payload;
      const response = yield axios.post(`${BASE_URL}/user-link/create`, {
        userId: userLinkInfo.userId,
        linkType: userLinkInfo?.linkType,
        title: userLinkInfo?.title,
        icon: userLinkInfo?.icon,
        url: userLinkInfo?.url,
      });

      if (response === undefined) {
        yield put(
          userLinksActions.setPhase("user-link-create-error", "Network Error")
        );
        return;
      } else if (response.status !== 200) {
        yield put(
          userLinksActions.setPhase(
            "user-link-create-error",
            response.data.message
          )
        );
        return;
      }

      const { userLink } = response.data;

      yield put(userLinksActions.setUserLink(userLink));
      yield put(userLinksActions.setPhase("user-link-create-success", null));
    }
  );

  yield takeLatest(
    actionTypes.UPDATE_USER_LINK,
    function* updateUserLinkSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userLinksActions.setPhase("update-loading", null));

      const { userLinkInfo } = payload;
      const response = yield axios.post(`${BASE_URL}/user-link/update`, {
        _id: userLinkInfo._id,
        link_type: userLinkInfo?.linkType,
        title: userLinkInfo?.title,
        icon: userLinkInfo?.icon,
        url: userLinkInfo?.url,
      });

      if (response === undefined) {
        yield put(userLinksActions.setPhase("update-error", "Network Error"));
        return;
      } else if (response.status !== 200) {
        yield put(
          userLinksActions.setPhase("update-error", response.data.message)
        );
        return;
      }

      const { userLink } = response.data;

      yield put(userLinksActions.setUserLink(userLink));
      yield put(userLinksActions.setPhase("update-success", null));
    }
  );

  yield takeLatest(
    actionTypes.DELETE_USER_LINK,
    function* deleteUserLinkSaga({
      payload,
    }: IAction<Partial<TActionAllState>>) {
      yield put(userLinksActions.setPhase("delete-loading", null));

      const { _id } = payload;
      const response = yield axios.post(`${BASE_URL}/user-link/remove`, {
        _id: _id,
      });

      if (response === undefined) {
        yield put(userLinksActions.setPhase("delete-error", "Network Error"));
        return;
      } else if (response.status !== 200) {
        yield put(
          userLinksActions.setPhase("delete-error", response.data.message)
        );
        return;
      }

      yield put(userLinksActions.removeUserLink(_id));
      yield put(userLinksActions.setPhase("delete-success", null));
    }
  );
}
