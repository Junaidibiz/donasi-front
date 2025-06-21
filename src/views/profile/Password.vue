<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <form @submit.prevent="updatePassword" method="POST">
        <div class="bg-white p-3 rounded-md shadow-md">
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-2">
              <label class="mt-2" for="new-password">Password Baru</label>
              <input
                type="password"
                id="new-password"
                class="mt-2 appearance-none w-full bg-gray-200 rounded h-7 shadow-sm placeholder-gray-700 focus:outline-none focus:placeholder-gray-600 focus:bg-gray-300 focus-within:text-gray-600 p-5"
                placeholder="Password Baru"
                v-model="user.password"
              />
            </div>

            <div class="mb-2">
              <label class="mt-2" for="confirm-password"
                >Konfirmasi Password Baru</label
              >
              <input
                type="password"
                id="confirm-password"
                class="mt-2 appearance-none w-full bg-gray-200 rounded h-7 shadow-sm placeholder-gray-700 focus:outline-none focus:placeholder-gray-600 focus:bg-gray-300 focus-within:text-gray-600 p-5"
                placeholder="Konfirmasi Password Baru"
                v-model="user.password_confirmation"
              />
            </div>

            <div>
              <button
                type="submit"
                class="mt-3 bg-gray-700 text-white p-2 w-full rounded-md shadow-md focus:outline-none"
              >
                UPDATE PASSWORD
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
//hook vue
import { reactive, ref } from "vue"; // <-- Import ref dan reactive [cite: Langkah 1 - View/Component Update Password]
//hook vuex
import { useStore } from "vuex";
//hook vue router
import { useRouter } from "vue-router";
//hook Toast
import { useToast } from "vue-toastification";

export default {
  name: "PasswordComponent",
  setup() {
    //store vuex
    const store = useStore();
    //route
    const router = useRouter();
    //same interface as this.$toast
    const toast = useToast();

    //state user
    const user = reactive({
      // <-- State untuk password baru [cite: Langkah 1 - View/Component Update Password]
      password: "",
      password_confirmation: "",
    });
    //validation state
    const validation = ref([]); // <-- State untuk pesan validasi [cite: Langkah 1 - View/Component Update Password]

    //method update password
    function updatePassword() {
      // <-- Fungsi updatePassword [cite: Langkah 1 - View/Component Update Password]
      let password = user.password;
      let password_confirmation = user.password_confirmation;

      //panggil actions "updatePassword" dari module "profile"
      store
        .dispatch("profile/updatePassword", {
          // <-- Memanggil action updatePassword dari Vuex [cite: Langkah 1 - View/Component Update Password]
          password,
          password_confirmation,
        })
        .then(() => {
          router.push({ name: "dashboard" }); // <-- Redirect ke dashboard [cite: Langkah 1 - View/Component Update Password]
          toast.success("Password Berhasil Diupdate!"); // <-- Toast sukses [cite: Langkah 1 - View/Component Update Password]
        })
        .catch((error) => {
          //assign validaation message
          validation.value = error; // <-- Assign error validasi [cite: Langkah 1 - View/Component Update Password]
          //show validation password with toast
          if (validation.value.password) {
            toast.error(`${validation.value.password[0]}`); // <-- Tampilkan error validasi password [cite: Langkah 1 - View/Component Update Password]
          }
          // Show general error message from backend if available
          if (validation.value.message && !validation.value.password) {
            toast.error(`${validation.value.message}`);
          }
        });
    }

    return {
      user, // <-- return state password
      validation, // <-- return state validation
      updatePassword, // <-- return method updatePassword
    };
  },
};
</script>

<style></style>
