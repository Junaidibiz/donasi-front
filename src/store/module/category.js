// Import global API
import Api from "../../api/Api";

const category = {
  // Set namespace true
  namespaced: true,

  // State
  state: {
    // Index categories (for homepage and category index page)
    categories: [],
    // Detail category (for category show page)
    category: {},
    // Campaigns associated with the specific category (for category show page)
    campaignCategory: [],
  },

  // Mutations
  mutations: {
    // Set state 'categories' with data from response
    SET_CATEGORIES(state, data) {
      state.categories = data;
    },
    // Set state 'category' with detail data from response
    DETAIL_CATEGORY(state, data) {
      state.category = data;
    },
    // Set state 'campaignCategory' with campaign data from response
    CAMPAIGN_CATEGORY(state, data) {
      state.campaignCategory = data;
    },
  },

  // Actions
  actions: {
    // Action to get categories for homepage (limited number, no auth required)
    getCategoryHome({ commit }) {
      Api.get("/categoryHome")
        .then((response) => {
          commit("SET_CATEGORIES", response.data.data);
        })
        .catch((error) => {
          console.log(error);
          // Optional: handle network/CORS errors
        });
    },
    // Action to get all categories (for category index page, potentially paginated)
    getCategory({ commit }) {
      Api.get("/category") // Assumes this endpoint returns paginated data (e.g., .data.data.data)
        .then((response) => {
          commit("SET_CATEGORIES", response.data.data.data); // Adjust if backend doesn't paginate
        })
        .catch((error) => {
          console.log(error);
          // Optional: handle network/CORS errors
        });
    },
    // Action to get a specific category's details and its associated campaigns by slug
    getDetailCategory({ commit }, slug) {
      Api.get(`/category/${slug}`)
        .then((response) => {
          commit("DETAIL_CATEGORY", response.data.data); // Commit detail category data
          commit("CAMPAIGN_CATEGORY", response.data.data.campaigns); // Commit associated campaigns
        })
        .catch((error) => {
          console.log(error);
          // Optional: handle 404 (not found) or other errors
        });
    },
  },
  // Getters (can be added here if needed to retrieve specific state data)
  getters: {
    // Example: get all categories from state
    getAllCategories(state) {
      return state.categories;
    },
    // Example: get the detailed category object
    getDetailedCategory(state) {
      return state.category;
    },
    // Example: get campaigns for the detailed category
    getCampaignsByCategory(state) {
      return state.campaignCategory;
    },
  },
};
export default category;
