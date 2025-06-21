// Import vue router
import { createRouter, createWebHistory } from "vue-router";
// Import store vuex
import store from "../store";

// Define a routes
const routes = [
  {
    path: "/register",
    name: "register",
    component: () =>
      import(/* webpackChunkName: "register" */ "../views/auth/Register.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/auth/Login.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ "../views/dashboard/Index.vue"
      ),
    meta: {
      // Check if loggedIn
      requiresAuth: true,
    },
  },
  {
    path: "/donation",
    name: "donation.index",
    component: () =>
      import(
        /* webpackChunkName: "donationIndex" */ "../views/donation/Index.vue"
      ),
    meta: {
      // Check if loggedIn
      requiresAuth: true,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/profile/Index.vue"),
    meta: {
      // Check if loggedIn
      requiresAuth: true,
    },
  },
  {
    path: "/profile/password",
    name: "profile.password",
    component: () =>
      import(
        /* webpackChunkName: "profilePassword" */ "../views/profile/Password.vue"
      ),
    meta: {
      // Check if loggedIn
      requiresAuth: true,
    },
  },
  {
    path: "/", // <-- NEW ROUTE FOR HOMEPAGE
    name: "home",
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/home/Index.vue"), // <-- Points to the new homepage component
  },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes, // <-- routes
});

// Define route for handle authentication
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Check "isLoggedIn" getter value in "auth" module
    if (store.getters["auth/isLoggedIn"]) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});

export default router;
