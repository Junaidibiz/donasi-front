<template>
  <div class="pb-20 pt-24 bg-gray-100 min-h-screen">
    <div class="container mx-auto grid grid-cols-1 p-4 sm:w-full md:w-5/12">
      <div class="bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg mx-auto">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Reset Password Baru
        </h2>
        <form @submit.prevent="reset" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1"
              >Password Baru</label
            >
            <input
              v-model="form.password"
              type="password"
              placeholder="Password Baru"
              class="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1"
              >Konfirmasi Password Baru</label
            >
            <input
              v-model="form.password_confirmation"
              type="password"
              placeholder="Konfirmasi Password"
              class="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg"
          >
            RESET PASSWORD
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  name: "ResetPasswordComponent",
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const form = reactive({
      email: "",
      password: "",
      password_confirmation: "",
      token: "",
    });

    onMounted(() => {
      form.email = route.query.email;
      form.token = route.query.token;
    });

    function reset() {
      store
        .dispatch("auth/resetPassword", form)
        .then(() => {
          toast.success("Password berhasil direset! Silakan login.");
          router.push({ name: "login" });
        })
        .catch((error) => {
          toast.error(
            error.message || "Token tidak valid atau sudah kedaluwarsa."
          );
        });
    }

    return { form, reset };
  },
};
</script>
