// store/modules/campaign.js

//import global API
import Api from "../../api/Api";

const campaign = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    campaigns: [],
    campaign: {},
    donations: [],
    nextExists: false,
    nextPage: 0,
  },

  //mutations
  mutations: {
    SET_CAMPAIGNS(state, campaigns) {
      state.campaigns = campaigns;
    },
    SET_DETAIL_CAMPAIGN(state, payload) {
      state.campaign = payload.data;
      state.donations = payload.donations;
    },
    SET_NEXTEXISTS(state, nextExists) {
      state.nextExists = nextExists;
    },
    SET_NEXTPAGE(state, nextPage) {
      state.nextPage = nextPage;
    },
    SET_LOADMORE(state, data) {
      data.forEach((row) => {
        state.campaigns.push(row);
      });
    },
  },

  //actions
  actions: {
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

    getDetailCampaign({ commit }, slug) {
      Api.get(`/campaign/${slug}`)
        .then((response) => {
          commit("SET_DETAIL_CAMPAIGN", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

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

    searchCampaign({ commit }, keyword) {
      Api.get(`/campaign/search?keyword=${keyword}`)
        .then((response) => {
          commit("SET_CAMPAIGNS", response.data.data.data);
          commit("SET_NEXTEXISTS", false);
          commit("SET_NEXTPAGE", 0);
        })
        .catch((error) => {
          console.log("Error saat pencarian:", error);
          commit("SET_CAMPAIGNS", []);
        });
    },
  },

  getters: {},
};

export default campaign;
