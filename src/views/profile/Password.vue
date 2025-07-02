<template>
  <div class="pb-20 pt-24">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div class="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 mx-auto">
        <h2
          class="text-2xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-2"
        >
          <i class="fa fa-key text-yellow-500"></i> Ubah Password
        </h2>

        <form @submit.prevent="updatePassword" class="space-y-6">
          <div>
            <label
              for="new-password"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >Password Baru</label
            >
            <input
              v-model="user.password"
              type="password"
              id="new-password"
              placeholder="Masukkan password baru"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              for="confirm-password"
              class="block text-sm font-semibold text-gray-700 mb-1"
              >Konfirmasi Password Baru</label
            >
            <input
              v-model="user.password_confirmation"
              type="password"
              id="confirm-password"
              placeholder="Konfirmasi password baru"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-700 transition font-semibold flex items-center justify-center gap-2 shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            Update Password
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// Bagian script tidak perlu diubah karena sudah menangani semua logika yang dibutuhkan.
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  name: "PasswordComponent",
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const user = reactive({
      password: "",
      password_confirmation: "",
    });

    const validation = ref([]);

    function updatePassword() {
      let password = user.password;
      let password_confirmation = user.password_confirmation;

      store
        .dispatch("profile/updatePassword", {
          password,
          password_confirmation,
        })
        .then(() => {
          router.push({ name: "dashboard" });
          toast.success("Password Berhasil Diupdate!");
        })
        .catch((error) => {
          validation.value = error;
          if (validation.value.password) {
            toast.error(`${validation.value.password[0]}`);
          }
          if (validation.value.message && !validation.value.password) {
            toast.error(`${validation.value.message}`);
          }
        });
    }

    return {
      user,
      validation,
      updatePassword,
    };
  },
};
</script>
