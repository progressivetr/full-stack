import Vue from "vue";
import Vuex from "vuex";
import { authStore } from "@/../packages/auth/auth.store";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    auth: authStore,
  },
});
