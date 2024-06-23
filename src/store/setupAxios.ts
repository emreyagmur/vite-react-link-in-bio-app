import { Store } from "redux";
import { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export default function setupAxios(axios: AxiosInstance, store: Store) {
  axios.interceptors.request.use(
    (config) => {
      const {
        auth: { accessToken },
      } = store.getState();

      if (config.method === "patch") {
        config.headers["Content-Type"] = "application/merge-patch+json";
      } else {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      return error.response;
    }
  );
}
