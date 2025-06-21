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
    user: {}, // <-- NEW STATE FOR FUNDRAISER USER
    //total donation (sum of donations for the campaign)
    sumDonation: [], // <-- NEW STATE FOR SUM OF DONATIONS
    //data donations (list of individual donations for the campaign)
    donations: [], // <-- NEW STATE FOR LIST OF DONATIONS
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
    //set state campaign with data from response (single campaign)
    SET_CAMPAIGN(state, data) {
      state.campaign = data;
    },
    // --- NEW MUTATIONS FOR CAMPAIGN DETAIL ---
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
          commit("SET_CAMPAIGN", response.data.data); // Commit campaign detail
          commit("DETAIL_USER", response.data.data.user); // Commit fundraiser user detail
          commit("DETAIL_SUMDONATION", response.data.data.sum_donation); // Commit sum donation
          commit("SET_DONATIONS", response.data.data.donations); // Commit list of donations
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
