//import global API
import Api from "../../api/Api";

const donation = {
  //set namespace true
  namespaced: true,

  //state
  state: {
    //donations
    donations: [],
    //loadmore
    nextExists: false,
    nextPage: 0,
  },

  //mutations
  mutations: {
    //set state donations dengan data dari response
    SET_DONATIONS(state, donations) {
      // Memastikan setiap donasi memiliki objek campaign yang valid
      state.donations = donations.map((item) => {
        return {
          ...item,
          campaign: item.campaign || {}, // Jika item.campaign undefined/null, set ke objek kosong
        };
      });
    },

    // --- TAMBAHKAN MUTATION BARU DI SINI ---
    UPDATE_DONATION_STATUS(state, updatedDonation) {
      // Cari index donasi di dalam array state.donations berdasarkan invoice
      const index = state.donations.findIndex(
        (donation) => donation.invoice === updatedDonation.invoice
      );

      // Jika donasi ditemukan di dalam state, update statusnya
      if (index !== -1) {
        state.donations[index].status = updatedDonation.status;
      }
    },

    //set state nextExists
    SET_NEXTEXISTS(state, nextExists) {
      state.nextExists = nextExists;
    },

    //set state nextPage
    SET_NEXTPAGE(state, nextPage) {
      state.nextPage = nextPage;
    },

    //set state "donations" dengan data dari response loadmore
    SET_LOADMORE(state, data) {
      // Memastikan setiap donasi yang di-loadmore juga memiliki objek campaign yang valid
      data.forEach((row) => {
        state.donations.push({
          ...row,
          campaign: row.campaign || {}, // Jika row.campaign undefined/null, set ke objek kosong
        });
      });
    },
  },

  //actions
  actions: {
    //action getDonation
    // Pastikan nama aksi ini 'getDonation' (huruf 'D' besar)
    getDonation({ commit }) {
      //get data token dan user
      const token = localStorage.getItem("token");

      //set axios header dengan type Authorization + Bearer token
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      //get data donations ke server
      Api.get("/donation")
        .then((response) => {
          //commit ke mutation SET_DONATIONS dengan response data
          commit("SET_DONATIONS", response.data.data.data);

          if (response.data.data.current_page < response.data.data.last_page) {
            commit("SET_NEXTEXISTS", true);
            commit("SET_NEXTPAGE", response.data.data.current_page + 1);
          } else {
            commit("SET_NEXTEXISTS", false);
          }
        })
        .catch((error) => {
          //show error log dari response
          console.log(error);
        });
    },

    //action getLoadMore
    // Pastikan nama aksi ini 'getLoadMore' (huruf 'L' dan 'M' besar)
    getLoadMore({ commit }, nextPage) {
      //get data token dan user
      const token = localStorage.getItem("token");

      //set axios header dengan type Authorization + Bearer token
      Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      //get data donations dengan parameter page ke server
      Api.get(`/donation?page=${nextPage}`)
        .then((response) => {
          //commit ke mutation SET_LOADMORE dengan response data
          commit("SET_LOADMORE", response.data.data.data);

          if (response.data.data.current_page < response.data.data.last_page) {
            commit("SET_NEXTEXISTS", true);
            commit("SET_NEXTPAGE", response.data.data.current_page + 1);
          } else {
            commit("SET_NEXTEXISTS", false);
          }
        })
        .catch((error) => {
          //show error log dari response
          console.log(error);
        });
    },

    //storeDonation
    storeDonation({ commit }, data) {
      //define callback promise
      return new Promise((resolve, reject) => {
        //get data token dan user
        const token = localStorage.getItem("token");

        //set axios header dengan type Authorization + Bearer token
        Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        //send data donatiion ke server
        Api.post("/donation", data)
          .then((response) => {
            commit(""); // Tidak perlu commit ke mutation tertentu untuk saat ini
            resolve(response);
          })
          .catch((error) => {
            //show error log dari response
            reject(error.response.data);
          });
      });
    },
  },

  //getters
  getters: {},
};

export default donation;
