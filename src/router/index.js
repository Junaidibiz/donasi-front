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
    path: "/category",
    name: "category.index",
    component: () =>
      import(
        /* webpackChunkName: "categoryIndex" */ "../views/category/Index.vue"
      ),
  },
  {
    path: "/category/:slug",
    name: "category.show",
    component: () =>
      import(
        /* webpackChunkName: "categoryShow" */ "../views/category/Show.vue"
      ),
  },
  {
    path: "/campaign",
    name: "campaign.index",
    component: () =>
      import(
        /* webpackChunkName: "campaignIndex" */ "../views/campaign/Index.vue"
      ),
  },
  {
    path: "/campaign/:slug",
    name: "campaign.show",
    component: () =>
      import(
        /* webpackChunkName: "campaignShow" */ "../views/campaign/Show.vue"
      ),
  },
  {
    path: "/donation/create/:slug",
    name: "donation.create",
    component: () =>
      import(
        /* webpackChunkName: "donationCreate" */ "../views/donation/Create.vue"
      ),
    meta: {
      requiresAuth: true, // <-- Route ini sudah ditandai dengan benar
    },
  },
  {
    path: "/search",
    name: "search",
    component: () =>
      import(/* webpackChunkName: "search" */ "../views/search/Index.vue"),
  },

  // --- TAMBAHKAN ROUTE BARU DI SINI ---
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("@/views/auth/ForgotPassword.vue"),
  },
  {
    path: "/reset-password", // tidak perlu /:token karena kita pakai query param
    name: "reset-password",
    component: () => import("@/views/auth/ResetPassword.vue"),
  },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes, // <-- routes
});

// =============================================================
//                      PERBAIKAN DI SINI
// =============================================================
router.beforeEach((to, from, next) => {
  // Cek jika route yang dituju memerlukan otentikasi
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // Jika pengguna BELUM login
    if (!store.getters["auth/isLoggedIn"]) {
      // Simpan URL yang ingin dituju ke localStorage
      localStorage.setItem("intended_url", to.fullPath);

      // Arahkan ke halaman login
      next("/login");
    } else {
      // Jika SUDAH login, biarkan pengguna melanjutkan
      next();
    }
  } else {
    // Jika route tidak memerlukan otentikasi, biarkan saja
    next();
  }
});
// =============================================================

export default router;
