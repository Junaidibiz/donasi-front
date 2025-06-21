//import global API
import Api from "../../api/Api";

const campaign = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //index campaigns
    campaigns: [], // <-- Array to store campaign data
    //loadmore
    nextExists: false, // <-- Indicates if there's a next page
    nextPage: 0, // <-- Next page number for pagination
  },

  //mutations
  mutations: {
    //set state campaigns with data from response
    SET_CAMPAIGNS(state, campaigns) {
      state.campaigns = campaigns;
    },
    //set state nextExists
    SET_NEXTEXISTS(state, nextExists) {
      state.nextExists = nextExists;
    },
    //set state nextPage
    SET_NEXTPAGE(state, nextPage) {
      state.nextPage = nextPage;
    },
    //set state campaigns with data from response loadmore
    SET_LOADMORE(state, data) {
      data.forEach((row) => {
        state.campaigns.push(row); // Add new data to existing campaigns array
      });
    },
  },

  //actions
  actions: {
    //action getCampaign
    getCampaign({ commit }) {
      //get campaign data from server
      Api.get("/campaign") // <-- Backend API endpoint for campaigns
        .then((response) => {
          //commit to SET_CAMPAIGNS mutation with response data
          commit("SET_CAMPAIGNS", response.data.data.data); // Assuming pagination data.data.data
          if (response.data.data.current_page < response.data.data.last_page) {
            //commit to SET_NEXTEXISTS mutation with true
            commit("SET_NEXTEXISTS", true);
            //commit to SET_NEXTPAGE mutation with current page + 1
            commit("SET_NEXTPAGE", response.data.data.current_page + 1);
          } else {
            //commit to SET_NEXTEXISTS mutation with false
            commit("SET_NEXTEXISTS", false);
          }
        })
        .catch((error) => {
          console.log(error);
          // Optional: Handle network errors or 401 Unauthorized
        });
    },
    //action getLoadMore
    getLoadMore({ commit }, nextPage) {
      //get campaign data with page parameter from server
      Api.get(`/campaign?page=${nextPage}`) // <-- Backend API endpoint with page parameter
        .then((response) => {
          //commit to SET_LOADMORE mutation with response data
          commit("SET_LOADMORE", response.data.data.data);
          if (response.data.data.current_page < response.data.data.last_page) {
            //commit to SET_NEXTEXISTS mutation with true
            commit("SET_NEXTEXISTS", true);
            //commit to SET_NEXTPAGE mutation with current page + 1
            commit("SET_NEXTPAGE", response.data.data.current_page + 1);
          } else {
            //commit to SET_NEXTEXISTS mutation with false
            commit("SET_NEXTEXISTS", false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  //getters
  getters: {},
};
export default campaign;
