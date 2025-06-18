//import vuex
import { createStore } from "vuex";

//import module auth
import auth from "./module/auth";

//import module donation
import donation from "./module/donation";

//import module profile
import profile from "./module/profile"; // <-- TAMBAHKAN IMPOR INI

//create store vuex
export default createStore({
  modules: {
    auth, // <-- module auth
    donation, // <-- module donation
    profile, // <-- TAMBAHKAN MODUL INI
  },
});
