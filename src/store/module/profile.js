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
    // --- ACTION BARU UNTUK MENGHAPUS AVATAR ---
    removeUserAvatar({ commit }) {
      // Action baru untuk menghapus avatar
      return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Panggil endpoint backend untuk menghapus avatar
        Api.post("/profile/remove-avatar") // Memanggil endpoint backend
          .then((response) => {
            commit("SET_PROFILE", response.data.data); // Update state profile menjadi null
            resolve(response);
          })
          .catch((error) => {
            console.error("Error menghapus avatar di backend:", error);
            reject(error.response.data);
          });
      });
    },
  },
  //getters
  getters: {},
};
export default profile;
