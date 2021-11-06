import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/group",
    name: "Group",
    component: () => import("@/views/GroupManager.vue"),
  },
  {
    path: "/activetodo",
    name: "ActiveTodo",
    component: () => import("@/views/ActiveTodo.vue"),
  },
  {
    path: "/completedtodo",
    name: "CompletedTodo",
    component: () => import("@/views/CompletedTodo.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
