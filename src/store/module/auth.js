//import global API
import Api from "../../api/Api";

const auth = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //state untuk "token", pakai localStorage, untuk menyimpan informasi tentang token
    token: localStorage.getItem("token") || "", // Ini sudah aman, akan menjadi '' jika null/undefined
    //state "user", pakai localStorage, untuk menyimpan data user yang sedang login
    user: JSON.parse(localStorage.getItem("user") || "{}"), // <--- Baris yang dioptimalkan
  },

  //mutations
  mutations: {
    //update state "token" dan state "user" dari hasil response
    AUTH_SUCCESS(state, token, user) {
      state.token = token;
      state.user = user;
    },
  },

  //actions
  actions: {
    register({ commit }, user) {
      return new Promise((resolve, reject) => {
        Api.post("/register", {
          name: user.name,
          email: user.email,
          password: user.password,
          password_confirmation: user.password_confirmation,
        })
          .then((response) => {
            // KOREKSI BAGIAN INI
            const token = response.data.access_token; // Ganti 'token' dengan 'access_token'
            const user = response.data.donatur; // Ganti 'data' dengan 'donatur'

            console.log("Token dari API:", token);
            console.log("User dari API:", user);

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            console.log(
              "Token di localStorage setelah set:",
              localStorage.getItem("token")
            );
            console.log(
              "User di localStorage setelah set:",
              localStorage.getItem("user")
            );

            Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            commit("AUTH_SUCCESS", token, user);

            resolve(response);
          })
          .catch((error) => {
            console.error("Error saat register:", error);
            localStorage.removeItem("token");
            reject(error.response.data);
          });
      });
    },
  },

  //getters
  getters: {},
};
export default auth;
