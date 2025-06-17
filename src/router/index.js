//import vue router
import { createRouter, createWebHistory } from "vue-router";
//import store vuex
import store from "../store"; // Impor root store Vuex

//define a routes
const routes = [
  {
    path: "/", // Homepage route
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
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
    path: "/dashboard", // Route baru untuk dashboard
    name: "dashboard",
    component: () =>
      import(
        /* webpackChunkName: "dashboard" */ "../views/dashboard/Index.vue"
      ),
    meta: {
      // Metadata untuk route ini
      //chek is loggedIn
      requiresAuth: true, // Menandai route ini memerlukan autentikasi
    },
  },
];

//create router
const router = createRouter({
  history: createWebHistory(),
  routes, // <-- routes,
});

//define route for handle authentication
router.beforeEach((to, from, next) => {
  // Navigation guard
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    //cek nilai dari getters isLoggedIn di module auth
    if (store.getters["auth/isLoggedIn"]) {
      // Memeriksa status login melalui getter Vuex
      next(); // Lanjutkan ke route yang dituju
      return;
    }
    next("/login"); // Redirect ke halaman login jika belum login
  } else {
    next(); // Lanjutkan jika route tidak memerlukan autentikasi
  }
});

export default router;
