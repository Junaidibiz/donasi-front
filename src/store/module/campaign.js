//import global API
import Api from "../../api/Api";

const campaign = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //index campaigns
    campaigns: [],
    //loadmore
    nextExists: false,
    nextPage: 0,
    // --- NEW STATE FOR SINGLE CAMPAIGN DETAIL ---
    campaign: {}, // Object to store single campaign details
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
        state.campaigns.push(row);
      });
    },
    // --- NEW MUTATION FOR SINGLE CAMPAIGN DETAIL ---
    SET_CAMPAIGN(state, data) {
      // Set state 'campaign' with detail data
      state.campaign = data;
    },
  },

  //actions
  actions: {
    //action getCampaign
    getCampaign({ commit }) {
      Api.get("/campaign")
        .then((response) => {
          commit("SET_CAMPAIGNS", response.data.data.data);
          if (response.data.data.current_page < response.data.data.last_page) {
            commit("SET_NEXTEXISTS", true);
            commit("SET_NEXTPAGE", response.data.data.current_page + 1);
          } else {
            commit("SET_NEXTEXISTS", false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //action getLoadMore
    getLoadMore({ commit }, nextPage) {
      Api.get(`/campaign?page=${nextPage}`)
        .then((response) => {
          commit("SET_LOADMORE", response.data.data.data);
          if (response.data.data.current_page < response.data.data.last_page) {
            commit("SET_NEXTEXISTS", true);
            commit("SET_NEXTPAGE", response.data.data.current_page + 1);
          } else {
            commit("SET_NEXTEXISTS", false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // --- NEW ACTION FOR SINGLE CAMPAIGN DETAIL ---
    // Action to get a specific campaign's details by slug
    getDetailCampaign({ commit }, slug) {
      Api.get(`/campaign/${slug}`) // Backend API endpoint for campaign detail
        .then((response) => {
          commit("SET_CAMPAIGN", response.data.data); // Commit detail campaign data
        })
        .catch((error) => {
          console.log(error);
          // Optional: handle 404 (not found) for specific campaign
        });
    },
  },
  //getters
  getters: {
    // Example: get all campaigns from state
    getAllCampaigns(state) {
      return state.campaigns;
    },
    // Example: get the detailed campaign object
    getDetailedCampaign(state) {
      return state.campaign;
    },
  },
};
export default campaign;
