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
    expenseReports: [], // <-- State untuk laporan pengeluaran
    nextExists: false,
    nextPage: 0,
  },

  //mutations
  mutations: {
    SET_CAMPAIGNS(state, campaigns) {
      state.campaigns = campaigns;
    },

    // =========================================================
    //                PERBAIKAN UTAMA ADA DI SINI
    // =========================================================
    SET_DETAIL_CAMPAIGN(state, campaignData) {
      if (campaignData) {
        state.campaign = campaignData;
        state.donations = campaignData.donations || [];
        // Pastikan kita juga mengambil expense_reports dari data API
        state.expenseReports = campaignData.expense_reports || [];
      } else {
        // Jika data kosong, reset semua state terkait
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
          commit("SET_DETAIL_CAMPAIGN", response.data.data);
        })
        .catch((error) => {
          console.log(error);
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
