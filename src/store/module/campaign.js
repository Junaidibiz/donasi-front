//import global API
import Api from "../../api/Api";

const campaign = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    campaigns: [],
    nextExists: false,
    nextPage: 0,
    campaign: {},
    user: {},
    sumDonation: [],
    donations: [],
  },

  //mutations
  mutations: {
    SET_CAMPAIGNS(state, campaigns) {
      state.campaigns = campaigns;
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
    SET_CAMPAIGN(state, data) {
      state.campaign = data;
    },
    DETAIL_USER(state, data) {
      state.user = data;
    },
    DETAIL_SUMDONATION(state, data) {
      state.sumDonation = data;
    },
    SET_DONATIONS(state, data) {
      state.donations = data;
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

    getDetailCampaign({ commit }, slug) {
      Api.get(`/campaign/${slug}`)
        .then((response) => {
          commit("SET_CAMPAIGN", response.data.data);
          commit("DETAIL_USER", response.data.data.user);
          commit("DETAIL_SUMDONATION", response.data.data.sum_donation);
          commit("SET_DONATIONS", response.data.data.donations);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    searchCampaign({ commit }, keyword) {
      if (!keyword) {
        commit("SET_CAMPAIGNS", []);
        return;
      }

      const token = localStorage.getItem("token");
      const config = {};

      if (token) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        };
      }

      // ================= PERUBAHAN DI SINI =================
      // Endpoint diubah dari /search menjadi /campaign
      Api.get(`/campaign?q=${keyword}`, config)
        .then((response) => {
          commit("SET_CAMPAIGNS", response.data.data.data);
        })
        .catch((error) => {
          console.log(error);
          commit("SET_CAMPAIGNS", []);
        });
    },
  },

  getters: {},
};

export default campaign;
