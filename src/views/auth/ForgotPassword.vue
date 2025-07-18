<template>
  <div class="pb-20 pt-24 bg-gray-100 min-h-screen">
    <div class="container mx-auto grid grid-cols-1 p-4 sm:w-full md:w-5/12">
      <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-auto">
        <h2 class="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Lupa Password
        </h2>
        <p class="text-sm text-gray-600 text-center mb-6">
          Masukkan email Anda dan kami akan mengirimkan link untuk mereset
          password.
        </p>
        <form @submit.prevent="sendLink" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1" for="email"
              >Alamat Email</label
            >
            <input
              v-model="email"
              type="email"
              id="email"
              placeholder="Alamat Email"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg"
          >
            KIRIM LINK
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";

export default {
  name: "ForgotPasswordComponent",
  setup() {
    const email = ref("");
    const store = useStore();
    const toast = useToast();

    function sendLink() {
      store
        .dispatch("auth/forgotPassword", { email: email.value })
        .then(() => {
          toast.success(
            "Link reset password telah dikirim, silakan cek email Anda."
          );
        })
        .catch((error) => {
          toast.error(error.message || "Terjadi kesalahan.");
        });
    }

    return { email, sendLink };
  },
};
</script>
