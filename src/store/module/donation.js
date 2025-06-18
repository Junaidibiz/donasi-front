//import global API
import Api from "../../api/Api";

const donation = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //donations
    donations: [], // <-- Array untuk menyimpan data donasi
    //loadmore
    nextExists: false, // <-- Menunjukkan apakah ada halaman berikutnya
    nextPage: 0, // <-- Nomor halaman berikutnya
  },

  //mutations
  mutations: {
    //set state donations dengan data dari response
    SET_DONATIONS(state, donations) {
      // <-- Mutation untuk mengatur data donasi awal
      state.donations = donations;
    },
    //set state nextExists
    SET_NEXTEXISTS(state, nextExists) {
      // <-- Mutation untuk mengatur nextExists
      state.nextExists = nextExists;
    },
    //set state nextPage
    SET_NEXTPAGE(state, nextPage) {
      // <-- Mutation untuk mengatur nextPage
      state.nextPage = nextPage;
    },
    //set state "donations" dengan data dari response loadmore
    SET_LOADMORE(state, data) {
      // <-- Mutation untuk menambahkan data loadmore
      data.forEach((row) => {
        state.donations.push(row); // Menambahkan data baru ke array donations
      });
    },
  },

  //actions
  actions: {
    //action getDonation
    getDonation({ commit }) {
      // <-- Action untuk mendapatkan data donasi awal
      //get data token dan user
      const token = localStorage.getItem("token");
      //set axios header dengan type Authorization + Bearer token
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      //get data donations ke server
      Api.get("/donation") // <-- Endpoint API Laravel untuk donasi
        .then((response) => {
          //commit ke mutation SET_DONATIONS dengan response data
          commit("SET_DONATIONS", response.data.data.data); // <-- Data donasi dari pagination response
          if (response.data.data.current_page < response.data.data.last_page) {
            //commit ke mutation SET_NEXTEXISTS dengan true
            commit("SET_NEXTEXISTS", true);
            //commit ke mutation SET_NEXTPAGE dengan current page + 1
            commit("SET_NEXTPAGE", response.data.data.current_page + 1);
          } else {
            //commit ke mutation SET_NEXTEXISTS dengan false
            commit("SET_NEXTEXISTS", false);
          }
        })
        .catch((error) => {
          //show error log dari response
          console.log(error);
          // Optional: Handle 401 Unauthorized here to redirect to login or clear token
        });
    },
    //action getLoadMore
    getLoadMore({ commit }, nextPage) {
      // <-- Action untuk memuat lebih banyak data
      //get data token dan user
      const token = localStorage.getItem("token");
      //set axios header dengan type Authorization + Bearer token
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      //get data donations dengan parameter page ke server
      Api.get(`/donation?page=${nextPage}`) // <-- Endpoint API dengan parameter page
        .then((response) => {
          //commit ke mutation SET_LOADMORE dengan response data
          commit("SET_LOADMORE", response.data.data.data); // <-- Data loadmore
          if (response.data.data.current_page < response.data.data.last_page) {
            //commit ke mutation SET_NEXTEXISTS dengan true
            commit("SET_NEXTEXISTS", true);
            //commit ke mutation SET_NEXTPAGE dengan current page + 1
            commit("SET_NEXTPAGE", response.data.data.current_page + 1);
          } else {
            //commit ke mutation SET_NEXTEXISTS dengan false
            commit("SET_NEXTEXISTS", false);
          }
        })
        .catch((error) => {
          //show error log dari response
          console.log(error);
        });
    },
  },
  //getters
  getters: {},
};
export default donation;
