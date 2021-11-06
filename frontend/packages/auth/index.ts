import Vue from "vue";

const eventBus = new Vue();
const storageTokenKey = "token";
const token = localStorage.getItem(storageTokenKey);
if (token) {
  import("../../src/store").then((store) =>
    store.default.dispatch("loginByToken", token)
  );
}

export { eventBus, storageTokenKey };
