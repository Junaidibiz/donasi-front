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
      // <-- MUTATION LOGOUT BARU
      state.token = ""; // <-- set state token ke empty
      state.user = {}; // <-- set state user ke empty object
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
          // Pertimbangkan untuk logout otomatis jika token tidak valid
          // commit('AUTH_LOGOUT');
          // localStorage.removeItem('token');
          // localStorage.removeItem('user');
          // delete Api.defaults.headers.common['Authorization'];
        });
    },
    //action logout
    logout({ commit }) {
      // <-- ACTION LOGOUT BARU
      return new Promise((resolve) => {
        // commit ke mutation AUTH_LOGOUT
        commit("AUTH_LOGOUT"); // <-- Panggil mutation AUTH_LOGOUT

        // remove value dari localStorage
        localStorage.removeItem("token"); // <-- Hapus token dari localStorage
        localStorage.removeItem("user"); // <-- Hapus user dari localStorage

        // delete header axios
        delete Api.defaults.headers.common["Authorization"]; // <-- Hapus header Authorization Axios

        // return resolve ke component
        resolve(); // <-- Resolve promise
      });
    },
  },
  //getters
  getters: {
    //get current user
    currentUser(state) {
      return state.user;
    },
    //loggedIn
    isLoggedIn(state) {
      return state.token;
    },
  },
};
export default auth;
