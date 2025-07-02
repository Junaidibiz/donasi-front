<template>
  <div class="pb-20 pt-24 bg-gray-100 min-h-screen">
    <div class="container mx-auto grid grid-cols-1 p-4 sm:w-full md:w-5/12">
      <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-auto">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Register Akun
        </h2>

        <form @submit.prevent="register" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1" for="nama"
              >Nama Lengkap</label
            >
            <input
              v-model="user.name"
              type="text"
              id="nama"
              placeholder="Nama Lengkap"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none"
            />
          </div>
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
          <div>
            <label class="block text-sm text-gray-600 mb-1" for="konfirmasi"
              >Konfirmasi Password</label
            >
            <input
              v-model="user.password_confirmation"
              type="password"
              id="konfirmasi"
              placeholder="Konfirmasi Password"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition duration-200"
          >
            DAFTAR
          </button>
        </form>
        <p class="text-sm text-center mt-6 text-gray-600">
          Sudah punya akun?
          <router-link
            :to="{ name: 'login' }"
            class="text-gray-800 hover:underline font-medium"
            >Masuk Disini!</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
// Bagian script tidak perlu diubah karena sudah menangani semua logika
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  name: "RegisterComponent",
  setup() {
    const user = reactive({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });

    const validation = ref([]);
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    function register() {
      let name = user.name;
      let email = user.email;
      let password = user.password;
      let password_confirmation = user.password_confirmation;

      store
        .dispatch("auth/register", {
          name,
          email,
          password,
          password_confirmation,
        })
        .then(() => {
          router.push({ name: "dashboard" });
          toast.success("Register Berhasil!");
        })
        .catch((error) => {
          validation.value = error;
          if (validation.value.name) {
            toast.error(`${validation.value.name[0]}`);
          }
          if (validation.value.email) {
            toast.error(`${validation.value.email[0]}`);
          }
          if (validation.value.password) {
            toast.error(`${validation.value.password[0]}`);
          }
        });
    }

    return {
      user,
      validation,
      register,
      toast,
    };
  },
};
</script>
