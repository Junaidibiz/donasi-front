// store/modules/campaign.js

//import global API
import Api from "../../api/Api";

const campaign = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    campaigns: [],
    // --- STATE DETAIL ---
    campaign: {}, // Untuk menyimpan objek campaign tunggal
    donations: [], // Untuk menyimpan daftar donasi dari campaign tersebut
    // ------------------
    nextExists: false,
    nextPage: 0,
  },

  //mutations
  mutations: {
    // Mutation untuk daftar campaign (sudah benar)
    SET_CAMPAIGNS(state, campaigns) {
      state.campaigns = campaigns;
    },

    // =============================================================
    //           KITA GANTI BEBERAPA MUTATION MENJADI SATU
    // =============================================================
    SET_DETAIL_CAMPAIGN(state, payload) {
      // payload adalah seluruh objek `response.data` dari API,
      // yang berisi { data: {..}, donations: [..] }

      state.campaign = payload.data; // Simpan objek campaign dari 'data'
      state.donations = payload.donations; // Simpan array donasi dari 'donations'
    },
    // =============================================================

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
    // Action getCampaign (tidak berubah)
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

    // =============================================================
    //              PERBAIKI ACTION getDetailCampaign
    // =============================================================
    getDetailCampaign({ commit }, slug) {
      Api.get(`/campaign/${slug}`)
        .then((response) => {
          // Commit SELURUH response.data ke mutation SET_DETAIL_CAMPAIGN
          commit("SET_DETAIL_CAMPAIGN", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // =============================================================

    // Action lain (getLoadMore, searchCampaign) tidak perlu diubah
    getLoadMore({ commit }, nextPage) {
      // ... kode Anda sudah benar ...
    },
    searchCampaign({ commit }, keyword) {
      // ... kode Anda sudah benar ...
    },
  },

  getters: {},
};

export default campaign;
