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
          if (error.response && error.response.status === 401) {
            commit("AUTH_LOGOUT");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete Api.defaults.headers.common["Authorization"];
          }
        });
    },
    //action logout
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("AUTH_LOGOUT");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete Api.defaults.headers.common["Authorization"];
        resolve();
      });
    },
    //action login
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        Api.post("/login", {
          email: user.email,
          password: user.password,
        })
          .then((response) => {
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

    // ========================================================
    //         TAMBAHKAN DUA ACTION BARU DI SINI
    // ========================================================

    forgotPassword({ commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.post("/forgot-password", payload)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response.data);
          });
      });
    },

    resetPassword({ commit }, payload) {
      return new Promise((resolve, reject) => {
        Api.post("/reset-password", payload)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            reject(error.response.data);
          });
      });
    },

    // ========================================================
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
