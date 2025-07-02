// File: src/store/module/profile.js

//import global API
import Api from "../../api/Api";

const profile = {
  namespaced: true,
  state: {
    profile: {},
  },
  mutations: {
    SET_PROFILE(state, data) {
      state.profile = data;
    },
  },
  actions: {
    getProfile({ commit }) {
      const token = localStorage.getItem("token");
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      Api.get("/profile")
        .then((response) => {
          commit("SET_PROFILE", response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateProfile({ dispatch }, formData) {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        Api.post("/profile", formData)
          .then((response) => {
            dispatch("getProfile");
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data);
          });
      });
    },
    updatePassword({ commit }, user) {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        Api.post("/profile/password", {
          password: user.password,
          password_confirmation: user.password_confirmation,
        })
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data);
          });
      });
    },
    // Action untuk menghapus foto profil
    removeAvatar({ dispatch }) {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        // Mengirim permintaan DELETE ke endpoint yang benar
        Api.delete("/profile/avatar")
          .then((response) => {
            dispatch("getProfile");
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data);
          });
      });
    },
  },
  getters: {},
};
export default profile;
