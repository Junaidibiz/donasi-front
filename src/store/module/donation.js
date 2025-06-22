//import global API
import Api from "../../api/Api";

const campaign = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //index campaigns (for homepage and campaign index page)
    campaigns: [],
    //loadmore
    nextExists: false,
    nextPage: 0,
    //detail campaign (single campaign object for show page)
    campaign: {},
    //detail user (the fundraiser/user who created the campaign)
    user: {},
    //total donation (sum of donations for the campaign)
    sumDonation: [],
    //data donations (list of individual donations for the campaign)
    donations: [],
  },

  //mutations
  mutations: {
    //set state campaigns with data from response
    SET_CAMPAIGNS(state, campaigns) {
      // Memastikan setiap campaign memiliki objek user yang valid sebelum di-map
      state.campaigns = campaigns.map((item) => {
        return {
          ...item,
          user: item.user || {}, // Set user ke objek kosong jika undefined/null
          sum_donation: item.sum_donation || [], // Set sum_donation ke array kosong jika undefined/null
          // Pastikan properti imageComputed dan tanggal lainnya dihandle di komponen yang merender
        };
      });
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
        state.campaigns.push({
          ...row,
          user: row.user || {}, // Pastikan user ada saat loadmore
          sum_donation: row.sum_donation || [], // Pastikan sum_donation ada saat loadmore
        });
      });
    },
    //set state campaign with data from response (single campaign)
    DETAIL_CAMPAIGN(state, data) {
      state.campaign = data;
    },
    //set state donatur with data from response (the fundraiser)
    DETAIL_USER(state, data) {
      state.user = data;
    },
    //set state sumDonation with data from response
    DETAIL_SUMDONATION(state, data) {
      state.sumDonation = data;
    },
    //set state donations with data from response (individual donations list)
    SET_DONATIONS(state, data) {
      state.donations = data;
    },
  },

  //actions
  actions: {
    //action getCampaign (for index and homepage)
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
    //action getLoadMore (for index and homepage)
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
    //action getDetailCampaign (for show page)
    getDetailCampaign({ commit }, slug) {
      Api.get(`/campaign/${slug}`)
        .then((response) => {
          commit("DETAIL_CAMPAIGN", response.data.data); // Commit campaign detail
          commit("DETAIL_USER", response.data.data.user); // Commit fundraiser user detail
          commit("DETAIL_SUMDONATION", response.data.data.sum_donation); // Commit sum donation
          commit("SET_DONATIONS", response.data.data.donations); // Commit list of donations
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * Aksi baru untuk mencari campaign berdasarkan query.
     * @param {Object} context - Objek konteks Vuex.
     * @param {string} querySearch - String pencarian dari user.
     */
    searchCampaign({ commit }, querySearch = "") {
      // <-- Aksi baru untuk pencarian
      // Tidak perlu token autentikasi jika endpoint ini publik
      // Jika endpoint membutuhkan autentikasi, aktifkan baris berikut:
      // const token = localStorage.getItem('token');
      // Api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      Api.get(`/campaign?q=${querySearch}`) // Endpoint API Laravel untuk pencarian
        .then((response) => {
          commit("SET_CAMPAIGNS", response.data.data.data); // Update state campaigns dengan hasil pencarian
        })
        .catch((error) => {
          console.log(error);
          // Handle error, misalnya tampilkan pesan ke user
        });
    },
  },
  //getters
  getters: {},
};
export default campaign;
