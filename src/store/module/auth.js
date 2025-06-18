//import global API
import Api from "../../api/Api";

const auth = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //state untuk "token", pakai localStorage, untuk menyimpan informasi tentang token
    token: localStorage.getItem("token") || "",
    //state "user", pakai localStorage, untuk menyimpan data user yang sedang login
    user: JSON.parse(localStorage.getItem("user") || "{}"),
  },

  //mutations
  mutations: {
    //update state "token" dan state "user" dari hasil response
    AUTH_SUCCESS(state, token, user) {
      state.token = token;
      state.user = user;
    },
    //update state user dari hasil response register / login
    GET_USER(state, user) {
      state.user = user;
    },
    //fungsi logout
    AUTH_LOGOUT(state) {
      state.token = "";
      state.user = {};
    },
  },

  //actions
  actions: {
    //action register
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        Api.post("/register", {
          name: user.name,
          email: user.email,
          password: user.password,
          password_confirmation: user.password_confirmation,
        })
          .then((response) => {
            // PASTIKAN PENGAMBILAN TOKEN DAN USER SESUAI DENGAN RESPON BACKEND
            const token = response.data.access_token;
            const user = response.data.donatur;

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            commit("AUTH_SUCCESS", token, user);
            commit("GET_USER", user);

            resolve(response);
          })
          .catch((error) => {
            localStorage.removeItem("token");
            reject(error.response.data);
          });
      });
    },
    //action getUser
    getUser({ commit }) {
      const token = localStorage.getItem("token");
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      Api.get("/user")
        .then((response) => {
          commit("GET_USER", response.data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          // Jika ada error saat mendapatkan user, mungkin token tidak valid, lakukan logout
          if (error.response && error.response.status === 401) {
            // Unauthorized
            commit("AUTH_LOGOUT");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete Api.defaults.headers.common["Authorization"];
            // Bisa juga redirect ke halaman login di sini jika diinginkan
          }
        });
    },
    //action logout
    logout({ commit }) {
      return new Promise((resolve) => {
        // API request to backend to invalidate token (optional, but good practice for security)
        // Api.post('/logout').then(() => { /* handle success */ }).catch(() => { /* handle error */ });

        commit("AUTH_LOGOUT");

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        delete Api.defaults.headers.common["Authorization"];

        resolve();
      });
    },
    //action login
    login({ commit }, user) {
      // <-- ACTION LOGIN BARU
      return new Promise((resolve, reject) => {
        Api.post("/login", {
          // <-- Endpoint Login Laravel
          email: user.email,
          password: user.password,
        })
          .then((response) => {
            // PASTIKAN PENGAMBILAN TOKEN DAN USER SESUAI DENGAN RESPON BACKEND
            const token = response.data.access_token; // <-- Ambil access_token
            const user = response.data.donatur; // <-- Ambil donatur

            localStorage.setItem("token", token); // <-- Simpan token ke localStorage
            localStorage.setItem("user", JSON.stringify(user)); // <-- Simpan user ke localStorage

            Api.defaults.headers.common["Authorization"] = `Bearer ${token}`; // <-- Atur header Authorization

            commit("AUTH_SUCCESS", token, user); // <-- Commit AUTH_SUCCESS
            commit("GET_USER", user); // <-- Commit GET_USER

            resolve(response); // <-- Resolve promise
          })
          .catch((error) => {
            localStorage.removeItem("token"); // <-- Hapus token jika login gagal
            reject(error.response.data); // <-- Reject promise dengan error
          });
      });
    },
  },
  //getters
  getters: {
    currentUser(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.token;
    },
  },
};
export default auth;
