<template>
  <div class="bg-white p-5 rounded-md shadow-md mb-5">
    <div class="flex items-center space-x-6 md:grid md:grid-cols-12 md:gap-4">
      <div class="col-span-1 md:col-span-2 w-24 h-24 flex-shrink-0">
        <img
          :src="avatarUrlComputed"
          class="rounded-full w-full h-full object-cover"
          alt="User Avatar"
        />
      </div>
      <div class="col-span-1 md:col-span-6">
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

    <router-link :to="{ name: 'donation.index' }" class="block">
      <div
        class="grid grid-cols-5 gap-4 bg-gray-300 p-3 rounded-md shadow-sm mb-3"
      >
        <div class="col-span-5">
          <i class="fa fa-heart" aria-hidden="true"></i> Donasi Saya
        </div>
      </div>
    </router-link>

    <router-link :to="{ name: 'profile' }" class="block">
      <div
        class="grid grid-cols-5 gap-4 bg-gray-300 p-3 rounded-md shadow-sm mb-3"
      >
        <div class="col-span-5">
          <i class="fa fa-user-circle" aria-hidden="true"></i> Profile Saya
        </div>
      </div>
    </router-link>

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
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import { useToast } from "vue-toastification";

export default {
  name: "DashboardComponent",
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    onMounted(() => {
      store.dispatch("auth/getUser"); //
    });

    const user = computed(() => {
      return store.state.auth.user; //
    });

    // Computed property untuk URL avatar
    const avatarUrlComputed = computed(() => {
      if (user.value && user.value.name) {
        if (user.value.avatar) {
          // !!! PENTING: SESUAIKAN BASE URL STORAGE LARAVEL ANDA DI SINI !!!
          // Contoh: 'http://localhost:8000/storage/'
          const LARAVEL_STORAGE_BASE_URL = "http://localhost:8000/storage/"; // <-- SESUAIKAN INI

          // Periksa apakah avatar sudah berupa URL lengkap atau masih hanya nama file
          if (
            user.value.avatar.startsWith("http://") ||
            user.value.avatar.startsWith("https://")
          ) {
            return user.value.avatar; // Jika sudah URL lengkap, langsung pakai
          } else {
            // Jika hanya nama file, tambahkan base URL storage
            return `${LARAVEL_STORAGE_BASE_URL}${user.value.avatar}`;
          }
        } else {
          // Fallback ke UI-Avatars.com jika properti avatar dari backend null atau kosong
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.value.name
          )}&background=random&color=fff&size=128`;
        }
      }
      return "";
    });

    // Fungsi logout
    function logout() {
      store.dispatch("auth/logout").then(() => {
        router.push({
          name: "login",
        });
        toast.success("Logout Berhasil!");
      });
    }

    return {
      logout,
      user, //
      avatarUrlComputed,
    };
  },
};
</script>

<style>
/* Anda dapat menambahkan gaya khusus di sini jika diperlukan, atau biarkan kosong jika sepenuhnya menggunakan Tailwind */
</style>
