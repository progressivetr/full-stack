import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import i18n from "./i18n";
import "@/../packages/element-io";
import "bootstrap/dist/css/bootstrap.min.css";
import { httpService } from "@/services/http.service";
import "@/../packages/auth";

Vue.config.productionTip = false;
Vue.prototype.$http = httpService;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
