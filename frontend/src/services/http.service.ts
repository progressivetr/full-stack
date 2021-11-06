import axios from "axios";
import i18n from "@/i18n";
import { MessageBox } from "element-ui";

export const apiURL = `${location.protocol}//${location.hostname}:${
  process.env.BACKEND_PORT || 3000
}`;

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = apiURL;

initializeCacheHeaders();
initializeInterceptors();

export const httpService = axiosInstance;

function initializeCacheHeaders() {
  //initialize cache headers
  const defaultHeaders = {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  };
  axiosInstance.defaults.headers.common = {
    ...axiosInstance.defaults.headers.common,
    ...defaultHeaders,
  };
}

function initializeInterceptors() {
  let isErrorDialogOpened = false;
  axiosInstance.interceptors.response.use(
    (req) => {
      return req;
    },
    (err) => {
      const response = err.response;
      const title = i18n.tc("http.error");
      let message = "";
      if (response) {
        const responseStatus = response.status;
        if (responseStatus === 403) {
          message = i18n.tc("http.permissionDenied");
        } else if (responseStatus !== 401 && response.data.message) {
          message = response.data.message;
        }
        if (!isErrorDialogOpened && message.length > 0) {
          isErrorDialogOpened = true;
          MessageBox.alert(message, title, {
            type: "error",
          }).then((action) => {
            if (action === "confirm") {
              isErrorDialogOpened = false;
            }
          });
        }
      } else {
        if (!isErrorDialogOpened) {
          isErrorDialogOpened = true;
          MessageBox.confirm(i18n.tc("http.serverConnectionError"), title, {
            type: "error",
            distinguishCancelAndClose: true,
            confirmButtonText: i18n.tc("http.retry"),
            cancelButtonText: i18n.tc("http.close"),
          }).then(() => {
            axiosInstance.request(err.config);
          });
        }
      }
      return Promise.reject(err);
    }
  );
}
