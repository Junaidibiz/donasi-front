import { createApp } from "vue";
import App from "./App.vue";

/**
 * import Toastr
 */
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

/**
 * Tailwind CSS
 */
import "./style.css";

/**
 * Mixins
 */
import mixins from "./mixins";

/**
 * Vue Router
 */
import router from "./router";

/**
 * Vuex
 */
import store from "./store"; // Import root store Vuex

//create App Vue
const app = createApp(App);

//gunakan "Toast" di Vue Js dengan plugin "use"
app.use(Toast);

//gunakan "Mixins" di Vue Js dengan plugin "use"
app.mixin(mixins);

//gunakan "router" di Vue Js dengan plugin "use"
app.use(router);

//gunakan "store" di Vue Js dengan plugin "use"
app.use(store); // Daftarkan store secara global

app.mount("#app");
