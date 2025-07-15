<template>
  <div class="pb-20 pt-24 bg-gray-100 min-h-screen">
    <div class="container mx-auto grid grid-cols-1 p-4 sm:w-full md:w-5/12">
      <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-auto">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Masuk Akun
        </h2>

        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1" for="email"
              >Alamat Email</label
            >
            <input
              v-model="user.email"
              type="email"
              id="email"
              placeholder="Alamat Email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1" for="password"
              >Password</label
            >
            <input
              v-model="user.password"
              type="password"
              id="password"
              placeholder="Password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            MASUK
          </button>
        </form>
        <p class="text-sm text-center mt-6 text-gray-600">
          Belum punya akun?
          <router-link
            :to="{ name: 'register' }"
            class="text-gray-800 hover:underline font-medium"
            >Daftar Sekarang!</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  name: "LoginComponent",
  setup() {
    const user = reactive({
      email: "",
      password: "",
    });

    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    function login() {
      store
        .dispatch("auth/login", {
          email: user.email,
          password: user.password,
        })
        .then(() => {
          toast.success("Login Berhasil!");

          // =============================================================
          //                      PERBAIKAN DI SINI
          // =============================================================

          // 1. Ambil URL yang disimpan dari localStorage
          const intendedUrl = localStorage.getItem("intended_url");

          if (intendedUrl) {
            // 2. Jika ada, hapus dari localStorage agar tidak digunakan lagi
            localStorage.removeItem("intended_url");

            // 3. Arahkan pengguna ke halaman yang diinginkan (halaman donasi)
            router.push(intendedUrl);
          } else {
            // 4. Jika tidak ada, arahkan ke halaman default (dashboard/beranda)
            router.push({ name: "dashboard" });
          }
          // =============================================================
        })
        .catch((error) => {
          // Logika error Anda sudah benar
          if (error.email) {
            toast.error(`${error.email[0]}`);
          } else if (error.password) {
            toast.error(`${error.password[0]}`);
          } else if (error.message) {
            toast.error(`${error.message}`);
          }
        });
    }

    onMounted(() => {
      if (store.getters["auth/isLoggedIn"]) {
        router.push({ name: "dashboard" });
      }
    });

    return {
      user,
      login,
    };
  },
};
</script>
