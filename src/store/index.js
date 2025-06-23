// Import vuex
import { createStore } from "vuex";

// Import module auth
import auth from "./module/auth";

// Import module donation
import donation from "./module/donation"; // <-- Pastikan ini diimpor

// Import module profile
import profile from "./module/profile";

// Import module slider
import slider from "./module/slider";

// Import module category
import category from "./module/category";

// Import module campaign
import campaign from "./module/campaign";

// Create store vuex
export default createStore({
  modules: {
    auth,
    donation, // <-- Pastikan ini terdaftar di sini
    profile,
    slider,
    category,
    campaign,
  },
});
