//import global API
import Api from "../../api/Api";

const category = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //index categories
    categories: [], // <-- Array to store category data
  },

  //mutations
  mutations: {
    //set state categories with data from response
    SET_CATEGORIES(state, data) {
      state.categories = data;
    },
  },

  //actions
  actions: {
    //action getCategoryHome
    getCategoryHome({ commit }) {
      //get category data from server for homepage
      Api.get("/categoryHome") // <-- Backend API endpoint for homepage categories
        .then((response) => {
          //commit to SET_CATEGORIES mutation with response data
          commit("SET_CATEGORIES", response.data.data); // <-- Category data from API response
        })
        .catch((error) => {
          //show error log from response
          console.log(error);
          // Optional: Handle CORS or other network errors here
        });
    },
  },
  //getters
  getters: {},
};
export default category;
