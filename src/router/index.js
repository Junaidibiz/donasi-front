// Import vue router
import { createRouter, createWebHistory } from "vue-router";
// Import store vuex
import store from "../store";

// Define routes
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
      requiresAuth: true,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/profile/Index.vue"),
    meta: {
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
      requiresAuth: true,
    },
  },
  {
    path: "/",
    name: "home",
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/home/Index.vue"),
  },
  {
    path: "/campaign/:slug",
    name: "campaign.show",
    component: () =>
      import(
        /* webpackChunkName: "campaignShow" */ "../views/campaign/Show.vue"
      ),
  },
  // --- NEW ROUTE FOR CATEGORY INDEX ---
  {
    path: "/category", // The path you are trying to access
    name: "category.index", // The name of the route
    component: () =>
      import(
        /* webpackChunkName: "categoryIndex" */ "../views/category/Index.vue"
      ),
    // meta: { requiresAuth: false } // Categories index usually public, adjust if needed
  },
  // --- NEW ROUTE FOR CATEGORY DETAIL ---
  {
    path: "/category/:slug", // Dynamic segment for category slug
    name: "category.show", // The name for category detail
    component: () =>
      import(
        /* webpackChunkName: "categoryDetail" */ "../views/category/Show.vue"
      ),
    // meta: { requiresAuth: false } // Category detail usually public
  },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Define route for handle authentication
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
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
