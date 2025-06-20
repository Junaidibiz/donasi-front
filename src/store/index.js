// Import vuex
import { createStore } from "vuex";

// Import module auth
import auth from "./module/auth";

// Import module donation
import donation from "./module/donation";

// Import module profile
import profile from "./module/profile";

// Import module slider
import slider from "./module/slider";

// Import module category
import category from "./module/category";

// Import module campaign
import campaign from "./module/campaign"; // <-- ADD THIS IMPORT

// Create store vuex
export default createStore({
  modules: {
    auth, // <-- auth module
    donation, // <-- donation module
    profile, // <-- profile module
    slider, // <-- slider module
    category, // <-- category module
    campaign, // <-- ADD THIS MODULE
  },
});
