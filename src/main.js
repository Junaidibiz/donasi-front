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
import "./style.css"; // Pastikan ini ada jika Anda mengikuti langkah instalasi Tailwind via @import di style.css

/**
 * Mixins
 */
import mixins from "./mixins"; // Import file mixins yang baru Anda buat

//create App Vue
const app = createApp(App);

//gunakan "Toast" di Vue Js dengan plugin "use"
app.use(Toast);

//gunakan "Mixins" di Vue Js dengan plugin "mixin"
app.mixin(mixins); // Daftarkan mixins secara global

app.mount("#app");
