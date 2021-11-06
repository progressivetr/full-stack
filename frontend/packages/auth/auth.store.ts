import { AuthUserDto } from "./dto/auth-user.dto";
import { Module } from "vuex";
import { AuthService } from "./auth.service";
import { httpService } from "@/services/http.service";
import { LoginDto } from "./dto/login.dto";
import jwtDecode from "jwt-decode";
import { JwtPayloadDto } from "./dto/jwt-payload.dto";
import { eventBus, storageTokenKey } from "./index";
import { MessageBox } from "element-ui";
import i18n from "../../src/i18n";

class State {
  isAuthenticated = false;
  user: AuthUserDto | null = null;
  sessionExpiredTimeout: number | null = null;
}

export const authStore: Module<any, any> = {
  state: new State(),
  mutations: {
    logout(state: State) {
      state.user = null;
      state.isAuthenticated = false;
    },
    login(state: State, user: AuthUserDto) {
      state.user = user;
      state.isAuthenticated = true;
    },
    setSessionTimeout(state: State, timeout: number | null) {
      if (state.sessionExpiredTimeout) {
        clearTimeout(state.sessionExpiredTimeout);
      }
      state.sessionExpiredTimeout = timeout;
    },
  },
  actions: {
    logout(context) {
      delete httpService.defaults.headers.common.authorization;
      localStorage.removeItem(storageTokenKey);
      context.commit("setSessionTimeout", null);
      return context.commit("logout");
    },
    setJWTTokenToHttpService(context, token: string) {
      httpService.defaults.headers.common.authorization = `Bearer ${token}`;
    },
    initializeExpireSessionJob(context, token: string) {
      const decodedToken = jwtDecode<JwtPayloadDto>(token);
      let sessionExpiredTimeout: number | null = null;
      const tokenExpireDate = new Date(decodedToken.exp * 1000);
      if (tokenExpireDate.getTime() - new Date().getTime() > 0) {
        sessionExpiredTimeout = runAtDate(tokenExpireDate, () => {
          eventBus.$emit("session-expired");
          context.dispatch("logout");
          MessageBox({
            type: "warning",
            title: i18n.tc("auth.warning"),
            message: i18n.tc("auth.sessionExpired"),
          });
        });
      }
      context.commit("setSessionTimeout", sessionExpiredTimeout);
    },
    loginByToken(context, token: string) {
      const decodedToken = jwtDecode<JwtPayloadDto>(token);
      const expireDurationMs = decodedToken.exp * 1000 - new Date().getTime();
      if (expireDurationMs <= 0) {
        localStorage.removeItem(storageTokenKey);
        return;
      }
      context
        .dispatch("setJWTTokenToHttpService", token)
        .then(() => {
          context.dispatch("initializeExpireSessionJob", token);
        })
        .then(() => {
          AuthService.getMe().then((res) => {
            context.commit("login", res.data);
          });
        });
    },
    loginByLoginDto(context, loginDto: LoginDto) {
      return AuthService.login(loginDto).then((res) => {
        const authHeader = res.headers.authorization;
        const token = authHeader.substr(7);
        if (loginDto.rememberMe) {
          localStorage.setItem(storageTokenKey, token);
        }
        context
          .dispatch("setJWTTokenToHttpService", token)
          .then(() => context.dispatch("initializeExpireSessionJob", token))
          .then(() => {
            context.commit("login", res.data);
            return res.data;
          });
      });
    },
  },
  getters: {
    isAuthenticated: (state): boolean => {
      return state.isAuthenticated;
    },
    user: (state): AuthUserDto | null => {
      return state.user;
    },
  },
};

function runAtDate(date: Date, func: () => any): number {
  const now = new Date().getTime();
  const then = date.getTime();
  const diff = Math.max(then - now, 0);
  if (diff > 0x7fffffff)
    //setTimeout limit is MAX_INT32=(2^31-1)
    return setTimeout(function () {
      runAtDate(date, func);
    }, 0x7fffffff);
  else return setTimeout(func, diff);
}
