//import global API
import Api from "../../api/Api";

const profile = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //profile state
    profile: {},
  },

  //mutations
  mutations: {
    //set state profile dengan data dari response
    SET_PROFILE(state, data) {
      state.profile = data;
    },
  },

  //actions
  actions: {
    //action getProfile
    getProfile({ commit }) {
      const token = localStorage.getItem("token");
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      Api.get("/profile")
        .then((response) => {
          commit("SET_PROFILE", response.data.data);
        })
        .catch((error) => {
          console.log(error);
          // Optional: Handle 401 Unauthorized jika diperlukan (redirect ke login, dll.)
        });
    },
    //action updateProfile
    updateProfile({ commit }, formData) {
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        Api.post("/profile", formData)
          .then((response) => {
            commit("SET_PROFILE", response.data.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data);
          });
      });
    },
    // --- ACTION BARU UNTUK UPDATE PASSWORD ---
    updatePassword({ commit }, user) {
      // <-- Action baru untuk update password [cite: Langkah 2 - Edit Module Profile Vuex]
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Endpoint backend untuk update password
        Api.post("/profile/password", {
          // <-- Endpoint API Laravel untuk update password [cite: Langkah 2 - Edit Module Profile Vuex]
          password: user.password,
          password_confirmation: user.password_confirmation,
        })
          .then((response) => {
            // Update profile state (jika backend mengembalikan data user setelah update password)
            commit("SET_PROFILE", response.data.data); // <-- Commit SET_PROFILE (opsional, tergantung backend) [cite: Langkah 2 - Edit Module Profile Vuex]
            resolve(response);
          })
          .catch((error) => {
            reject(error.response.data); // <-- Reject promise dengan error [cite: Langkah 2 - Edit Module Profile Vuex]
          });
      });
    },
  },
  //getters
  getters: {},
};
export default profile;
