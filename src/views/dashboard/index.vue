<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div class="bg-white p-5 rounded-md shadow-md mb-5">
        <!-- Bagian atas: Avatar, Nama, Edit Profile -->
        <!-- Menggunakan flexbox untuk layar kecil dan grid untuk layar medium ke atas -->
        <div
          class="flex items-center space-x-4 md:grid md:grid-cols-12 md:gap-4"
        >
          <!-- Kolom Avatar: ukuran tetap 96x96px, tidak menyusut -->
          <div class="col-span-1 md:col-span-2 w-24 h-24 flex-shrink-0">
            <!-- Gambar avatar mengisi penuh div parent yang sudah berukuran tetap -->
            <img
              :src="avatarUrlComputed"
              class="rounded-full w-full h-full object-cover"
              alt="User Avatar"
            />
          </div>
          <!-- Kolom Nama dan Tombol Edit: tanpa padding-left karena jarak diatur oleh space-x-4/gap-4 -->
          <div class="pl-8 col-span-1 md:col-span-6">
            <div class="font-bold text-base">
              {{ user.name }}
            </div>
            <div class="mt-3">
              <!-- Update Edit Profile Link to router-link -->
              <router-link
                :to="{ name: 'profile' }"
                class="bg-gray-700 py-1 px-3 rounded shadow-md text-white uppercase block text-center"
                >Edit Profile</router-link
              >
            </div>
          </div>
        </div>
        <!-- Garis pemisah -->
        <div class="border-2 border-gray-200 mt-3 mb-2"></div>

        <!-- Bagian Menu Utama -->
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

        <!-- Ubah Password Link -->
        <router-link :to="{ name: 'profile.password' }" class="block">
          <div
            class="grid grid-cols-5 gap-4 bg-gray-300 p-3 rounded-md shadow-sm mb-3"
          >
            <div class="col-span-5">
              <i class="fa fa-key" aria-hidden="true"></i> Ubah Password
            </div>
          </div>
        </router-link>

        <!-- Tombol Logout -->
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
      store.dispatch("auth/getUser");
    });

    const user = computed(() => {
      return store.state.auth.user;
    });

    const avatarUrlComputed = computed(() => {
      if (user.value && user.value.name) {
        if (user.value.avatar) {
          const LARAVEL_STORAGE_BASE_URL =
            "http://donasi-dm.test/storage/donaturs/"; // <-- ADJUST THIS

          if (
            user.value.avatar.startsWith("http://") ||
            user.value.avatar.startsWith("https://")
          ) {
            return user.value.avatar;
          } else {
            return `${LARAVEL_STORAGE_BASE_URL}${user.value.avatar}`;
          }
        } else {
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.value.name
          )}&background=random&color=fff&size=128`;
        }
      }
      return "";
    });

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
      user,
      avatarUrlComputed,
    };
  },
};
</script>

<style>
/* You can add custom styles here if needed, or leave it empty if fully using Tailwind */
</style>
