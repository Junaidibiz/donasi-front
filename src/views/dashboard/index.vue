<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div class="bg-white p-5 rounded-md shadow-md mb-5">
        <div class="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
          <div class="col-span-1 md:col-span-2 w-24 h-24 flex-shrink-0">
            <img
              :src="avatarUrlComputed"
              class="rounded-full w-full h-full object-cover"
              alt="User Avatar"
            />
          </div>
          <div class="col-span-1 md:col-span-6 pl-4">
            <div class="font-bold text-base">
              {{ user.name }}
            </div>
            <div class="mt-3">
              <a
                href="#"
                class="bg-gray-700 py-1 px-3 rounded shadow-md text-white uppercase"
                >Edit Profile</a
              >
            </div>
          </div>
        </div>
        <div class="border-2 border-gray-200 mt-3 mb-2"></div>

        <a href="#">
          <div
            class="grid grid-cols-5 gap-4 bg-gray-300 p-3 rounded-md shadow-sm mb-3"
          >
            <div class="col-span-5">
              <i class="fa fa-heart" aria-hidden="true"></i> Donasi Saya
            </div>
          </div>
        </a>

        <a href="#">
          <div
            class="grid grid-cols-5 gap-4 bg-gray-300 p-3 rounded-md shadow-sm mb-3"
          >
            <div class="col-span-5">
              <i class="fa fa-user-circle" aria-hidden="true"></i> Profile Saya
            </div>
          </div>
        </a>

        <a href="#">
          <div
            class="grid grid-cols-5 gap-4 bg-gray-300 p-3 rounded-md shadow-sm mb-3"
          >
            <div class="col-span-5">
              <i class="fa fa-key" aria-hidden="true"></i> Ubah Password
            </div>
          </div>
        </a>

        <a @click="logout" style="cursor: pointer">
          <div
            class="grid grid-cols-5 gap-4 bg-gray-300 p-3 rounded-md shadow-sm mb-3"
          >
            <div class="col-span-5">
              <i class="fa fa-sign-out-alt" aria-hidden="true"></i> Logout
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
//hook vuex
import { useStore } from "vuex";
//hook vue router
import { useRouter } from "vue-router"; // <-- TAMBAHKAN IMPOR INI
//hook vue
import { computed, onMounted } from "vue";
//hook Toast
import { useToast } from "vue-toastification"; // <-- TAMBAHKAN IMPOR INI

export default {
  name: "DashboardComponent",
  setup() {
    //store vuex
    const store = useStore();
    //vue router
    const router = useRouter(); // <-- INISIALISASI INI
    // Same interface as this.$toast
    const toast = useToast(); // <-- INISIALISASI INI

    //mounted
    onMounted(() => {
      //panggil action "getUser" dari module "auth" vuex
      store.dispatch("auth/getUser");
    });

    //data user login
    const user = computed(() => {
      return store.state.auth.user;
    });

    // Computed property untuk URL avatar inisial
    const avatarUrlComputed = computed(() => {
      if (user.value && user.value.name) {
        return (
          user.value.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.value.name
          )}&background=random&color=fff&size=128`
        );
      }
      return "";
    });

    // method logout
    function logout() {
      // <-- FUNGSI LOGOUT BARU
      //panggil action "logout" di dalam module "auth"
      store.dispatch("auth/logout").then(() => {
        //jika berhasil, akan di arahkan ke route login
        router.push({
          name: "login",
        });
        toast.success("Logout Berhasil!");
      });
    }

    //return a state and function
    return {
      logout, // <-- METHOD LOGOUT DI-RETURN
      user,
      avatarUrlComputed, // <-- PASTIKAN INI MASIH DI-RETURN
    };
  },
};
</script>

<style>
/* Anda dapat menambahkan gaya khusus di sini jika diperlukan, atau biarkan kosong jika sepenuhnya menggunakan Tailwind */
</style>
