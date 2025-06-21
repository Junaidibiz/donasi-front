//import global API
import Api from "../../api/Api";

const slider = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //index sliders
    sliders: [], // <-- Array to store slider data
  },

  //mutations
  mutations: {
    //set state sliders with data from response
    SET_SLIDERS(state, data) {
      state.sliders = data;
    },
  },

  //actions
  actions: {
    //action getSlider
    getSlider({ commit }) {
      //get slider data from server
      Api.get("/slider") // <-- Backend API endpoint for sliders
        .then((response) => {
          //commit to SET_SLIDERS mutation with response data
          commit("SET_SLIDERS", response.data.data); // <-- Slider data from API response
        })
        .catch((error) => {
          //show error log from response
          console.log(error);
        });
    },
  },
  //getters
  getters: {},
};
export default slider;
