<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-5 sm:w-full md:w-5/12">
      <form @submit.prevent="login">
        <div class="bg-white rounded-md shadow-md p-5">
          <div class="text-xl">MASUK AKUN</div>
          <div class="border-2 border-gray-200 mt-3 mb-2"></div>

          <div class="mb-5">
            <label class="mt-2" for="login-email">Alamat Email</label>
            <input
              type="email"
              id="login-email"
              v-model="user.email"
              class="mt-2 appearance-none w-full bg-gray-200 border border-gray-200 rounded h-7 shadow-sm placeholder-gray-600 focus:outline-none focus:placeholder-gray-600 focus:bg-white focus-within:text-gray-600 p-5"
              placeholder="Alamat Email"
            />
          </div>

          <div class="mb-5">
            <label class="mt-2" for="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              v-model="user.password"
              class="mt-2 appearance-none w-full bg-gray-200 border border-gray-200 rounded h-7 shadow-sm placeholder-gray-600 focus:outline-none focus:placeholder-gray-600 focus:bg-white focus-within:text-gray-600 p-5"
              placeholder="Password"
            />
          </div>

          <div>
            <button
              class="bg-gray-700 py-1 px-3 text-white rounded-md shadow-md text-xl inline-block w-full focus:outline-none focus:bg-gray-900"
            >
              MASUK
            </button>
          </div>
        </div>
      </form>

      <div class="text-center mt-5">
        Belum punya akun ?
        <router-link :to="{ name: 'register' }" class="underline text-blue-600"
          >Daftar Sekarang !</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
//hook vue
import { ref, reactive, onMounted } from "vue"; // <-- TAMBAHKAN onMounted DI SINI
//hook vuex
import { useStore } from "vuex";
//hook vue router
import { useRouter } from "vue-router";
//hook Toast
import { useToast } from "vue-toastification";

export default {
  name: "LoginComponent",
  setup() {
    //user state
    const user = reactive({
      // Mendefinisikan state user dengan reactive
      email: "",
      password: "",
    });
    //validation state
    const validation = ref([]); // Mendefinisikan state validation dengan ref
    //store vuex
    const store = useStore(); // Menggunakan hook useStore
    //route
    const router = useRouter(); // Menggunakan hook useRouter
    // Same interface as this.$toast
    const toast = useToast(); // Menggunakan hook useToast

    //method login
    function login() {
      // <-- FUNGSI LOGIN BARU
      //define variable
      let email = user.email;
      let password = user.password;

      //panggil actions "login" dari module "auth" Vuex
      store
        .dispatch("auth/login", {
          // Memanggil action 'auth/login' dari Vuex
          email,
          password,
        })
        .then(() => {
          //redirect ke dashboard
          router.push({ name: "dashboard" });
          toast.success("Login Berhasil!");
        })
        .catch((error) => {
          //assign validation message
          validation.value = error; // Mengisi state validation dengan error response
          //show validation email with toast
          if (validation.value.email) {
            toast.error(`${validation.value.email[0]}`);
          }
          //show validation password with toast
          if (validation.value.password) {
            toast.error(`${validation.value.password[0]}`);
          }
          //show login failed (jika ada pesan error umum dari backend)
          if (validation.value.message) {
            toast.error(`${validation.value.message}`);
          }
        });
    }

    //check user is loggedIn
    onMounted(() => {
      // <-- LOGIKA CHECK LOGIN SAAT KOMPONEN DIMUAT
      if (store.getters["auth/isLoggedIn"]) {
        router.push({ name: "dashboard" }); // Redirect ke dashboard jika sudah login
      }
    });

    //return object
    return {
      user, // <-- state user
      validation, // <-- state validation
      login, // <-- method login
    };
  },
};
</script>

<style></style>
