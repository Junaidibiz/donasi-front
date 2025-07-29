// src/store/module/campaign.js

import Api from "../../api/Api";

const campaign = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    campaigns: [],
    campaign: {},
    donations: [],
    expenseReports: [],
    nextExists: false,
    nextPage: 0,
  },

  //mutations
  mutations: {
    SET_CAMPAIGNS(state, campaigns) {
      state.campaigns = campaigns;
    },
    // Mutasi ini akan menerima seluruh objek campaign yang sudah lengkap
    SET_DETAIL_CAMPAIGN(state, campaignData) {
      // Pastikan campaignData ada isinya (tidak null)
      if (campaignData) {
        state.campaign = campaignData;
        // Ambil data relasi dari DALAM objek campaignData
        state.donations = campaignData.donations || [];
        state.expenseReports = campaignData.expense_reports || [];
      } else {
        // Jika data kosong (misal karena API error), reset state
        state.campaign = {};
        state.donations = [];
        state.expenseReports = [];
      }
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
      Api.get("/campaign").then((response) => {
        commit("SET_CAMPAIGNS", response.data.data.data);
        if (response.data.data.current_page < response.data.data.last_page) {
          commit("SET_NEXTEXISTS", true);
          commit("SET_NEXTPAGE", response.data.data.current_page + 1);
        } else {
          commit("SET_NEXTEXISTS", false);
        }
      });
    },

    getDetailCampaign({ commit }, slug) {
      Api.get(`/campaign/${slug}`)
        .then((response) => {
          // Kirim seluruh objek "data" dari API ke mutasi
          commit("SET_DETAIL_CAMPAIGN", response.data.data);
        })
        .catch((error) => {
          console.log(error);
          // Jika API error, kirim payload null agar tidak crash
          commit("SET_DETAIL_CAMPAIGN", null);
        });
    },

    getLoadMore({ commit }, nextPage) {
      Api.get(`/campaign?page=${nextPage}`).then((response) => {
        commit("SET_LOADMORE", response.data.data.data);
        if (response.data.data.current_page < response.data.data.last_page) {
          commit("SET_NEXTEXISTS", true);
          commit("SET_NEXTPAGE", response.data.data.current_page + 1);
        } else {
          commit("SET_NEXTEXISTS", false);
        }
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
