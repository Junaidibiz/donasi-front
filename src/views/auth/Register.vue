<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-5 sm:w-full md:w-5/12">
      <form @submit.prevent="register">
        <div class="bg-white rounded-md shadow-md p-5">
          <div class="text-xl">REGISTER AKUN</div>
          <div class="border-2 border-gray-200 mt-3 mb-2"></div>

          <div class="mb-2">
            <label class="mt-2">Nama Lengkap</label>
            <input
              type="text"
              v-model="user.name"
              class="mt-2 appearance-none w-full bg-gray-200 border border-gray-200 rounded h-7 shadow-sm placeholder-gray-600 focus:outline-none focus:placeholder-gray-600 focus:bg-white focus-within:text-gray-600 p-5"
              placeholder="Nama Lengkap"
            />
          </div>

          <div class="mb-2">
            <label class="mt-2">Alamat Email</label>
            <input
              type="email"
              v-model="user.email"
              class="mt-2 appearance-none w-full bg-gray-200 border border-gray-200 rounded h-7 shadow-sm placeholder-gray-600 focus:outline-none focus:placeholder-gray-600 focus:bg-white focus-within:text-gray-600 p-5"
              placeholder="Alamat Email"
            />
          </div>

          <div class="cols-span-1 mb-5">
            <label class="mt-2">Password</label>
            <input
              type="password"
              v-model="user.password"
              class="mt-2 appearance-none w-full bg-gray-200 border border-gray-200 rounded h-7 shadow-sm placeholder-gray-600 focus:outline-none focus:placeholder-gray-600 focus:bg-white focus-within:text-gray-600 p-5"
              placeholder="Password"
            />
          </div>

          <div class="cols-span-1 mb-5">
            <label class="mt-2">Konfirmasi Password</label>
            <input
              type="password"
              v-model="user.password_confirmation"
              class="mt-2 appearance-none w-full bg-gray-200 border border-gray-200 rounded h-7 shadow-sm placeholder-gray-600 focus:outline-none focus:placeholder-gray-600 focus:bg-white focus-within:text-gray-600 p-5"
              placeholder="Konfirmasi Password"
            />
          </div>

          <div>
            <button
              class="bg-gray-700 py-1 px-3 text-white rounded-md shadow-md text-xl inline-block w-full focus:outline-none focus:bg-gray-900"
            >
              DAFTAR
            </button>
          </div>
        </div>
      </form>

      <div class="text-center mt-5">
        Sudah punya akun ?
        <router-link :to="{ name: 'login' }" class="underline text-blue-600"
          >Masuk Disini !</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
//hook vue
import { ref, reactive } from "vue"; // Import ref dan reactive untuk reactivity API

//hook vuex
import { useStore } from "vuex"; // Import useStore dari vuex

//hook vue router
import { useRouter } from "vue-router"; // Import useRouter dari vue-router

//hook Toast
import { useToast } from "vue-toastification"; // Import useToast dari vue-toastification

export default {
  name: "RegisterComponent",
  setup() {
    // Menggunakan setup() untuk Composition API
    //user state
    const user = reactive({
      // Mendefinisikan state user dengan reactive
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });

    //validation state
    const validation = ref([]); // Mendefinisikan state validation dengan ref

    //store vuex
    const store = useStore(); // Menggunakan hook useStore

    //route
    const router = useRouter(); // Menggunakan hook useRouter

    //same interface as this.$toast
    const toast = useToast(); // Menggunakan hook useToast

    //function register, fungsi ini di jalankan ketika form di submit
    function register() {
      //define variable
      let name = user.name;
      let email = user.email;
      let password = user.password;
      let password_confirmation = user.password_confirmation;

      //panggil actions "register" dari module "auth"
      store
        .dispatch("auth/register", {
          // Memanggil action 'auth/register' dari Vuex
          name,
          email,
          password,
          password_confirmation,
        })
        .then(() => {
          //redirect ke dashboard
          router.push({ name: "dashboard" }); // Redirect ke route 'dashboard' setelah sukses

          toast.success("Register Berhasil!"); // Menampilkan toast sukses
        })
        .catch((error) => {
          //show validaation message
          validation.value = error; // Mengisi state validation dengan error response

          //show validation name with toast
          if (validation.value.name) {
            toast.error(`${validation.value.name[0]}`); // Menampilkan error validasi nama
          }

          //show validation email with toast
          if (validation.value.email) {
            toast.error(`${validation.value.email[0]}`); // Menampilkan error validasi email
          }

          //show validation password with toast
          if (validation.value.password) {
            toast.error(`${validation.value.password[0]}`); // Menampilkan error validasi password
          }
        });
    }

    //return a state and function
    return {
      user, // <-- state user
      validation, // <-- state validation
      register, // <-- method register
      toast, // <-- hook toast
    };
  },
};
</script>

<style></style>
