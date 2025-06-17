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

        <a href="#">
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
import { computed, onMounted } from "vue";

export default {
  name: "DashboardComponent",
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch("auth/getUser"); //
    });

    const user = computed(() => {
      return store.state.auth.user; //
    });

    const avatarUrlComputed = computed(() => {
      // Jika user dan user.name ada
      if (user.value && user.value.name) {
        // Jika user.avatar dari backend ada dan bukan null/undefined, gunakan itu.
        // Jika tidak, gunakan UI-Avatars.com
        return (
          user.value.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.value.name
          )}&background=random&color=fff&size=128`
        );
      }
      // Fallback jika user atau nama belum tersedia (misal saat inisialisasi)
      return "";
    });

    return {
      user, //
      avatarUrlComputed,
    };
  },
};
</script>

<style>
/* Anda dapat menambahkan gaya khusus di sini jika diperlukan, atau biarkan kosong jika sepenuhnya menggunakan Tailwind */
</style>
