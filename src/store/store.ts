import { Action, configureStore, Store } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import { persistStore } from "redux-persist";
import { all } from "redux-saga/effects";
import RootReducer from "./rootReducer";
import * as auth from "@/pages/auth/_store/auth";
import { saga as userLinkSaga } from "@/pages/link/_store/link";

const sagaMiddleware = createSagaMiddleware();

export function* rootSaga() {
  const mainSagas = [auth.saga(), userLinkSaga()];
  yield all(mainSagas);
}

const store: Store = configureStore({
  reducer: RootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      thunk: true,
    }).concat(sagaMiddleware, logger),
  devTools: process.env.NODE_ENV !== "production",
});
// }).concat(sagaMiddleware, process.env.NODE_ENV !== 'production' ? logger : null),

export const persistor = persistStore(store);

// Run sagas
sagaMiddleware.run(rootSaga);

// Run watchers
// useStoreWatchers(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type TPhase =
  | null
  | "loading"
  | "adding"
  | "updating"
  | "deleting"
  | "error"
  | "success";

export type AppError = {
  key: string;
  title: string;
};
export interface IAction<T> extends Action<string> {
  type: string;
  payload?: T;
}

export default store;
