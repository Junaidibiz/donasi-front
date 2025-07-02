<template>
  <div class="pb-20 pt-24">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div
        class="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden mx-auto p-6"
      >
        <div class="flex flex-col md:flex-row justify-between gap-6">
          <div
            class="w-full md:w-1/3 flex flex-col items-center text-center space-y-4"
          >
            <img
              :src="avatarUrlComputed"
              alt="Foto Profil"
              class="w-28 h-28 rounded-full border-4 border-gray-200 shadow-md object-cover mx-auto"
            />
            <h2 class="text-xl font-semibold text-gray-800">{{ user.name }}</h2>
            <p class="text-base text-gray-500">{{ user.email }}</p>
          </div>

          <div
            class="w-full md:w-2/3 flex flex-col gap-4 justify-center mt-6 md:mt-0"
          >
            <router-link
              :to="{ name: 'donation.index' }"
              class="flex items-center justify-start gap-4 p-4 rounded-md bg-gray-100 hover:bg-gray-200 transition w-full"
            >
              <i class="fa fa-heart text-xl text-gray-600 w-6 text-center"></i>
              <span class="text-gray-800 font-medium">Donasi Saya</span>
            </router-link>

            <router-link
              :to="{ name: 'profile' }"
              class="flex items-center justify-start gap-4 p-4 rounded-md bg-gray-100 hover:bg-gray-200 transition w-full"
            >
              <i
                class="fa fa-user-circle text-xl text-gray-600 w-6 text-center"
              ></i>
              <span class="text-gray-800 font-medium">Edit Profil</span>
            </router-link>

            <router-link
              :to="{ name: 'profile.password' }"
              class="flex items-center justify-start gap-4 p-4 rounded-md bg-gray-100 hover:bg-gray-200 transition w-full"
            >
              <i class="fa fa-key text-xl text-gray-600 w-6 text-center"></i>
              <span class="text-gray-800 font-medium">Ubah Password</span>
            </router-link>
          </div>
        </div>

        <div class="pt-6 mt-6">
          <a
            @click="logout"
            class="flex items-center justify-center gap-3 p-4 rounded-md bg-red-100 hover:bg-red-200 transition w-full cursor-pointer"
          >
            <i class="fa fa-sign-out-alt text-xl text-red-600"></i>
            <span class="text-red-700 font-medium">Logout</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Bagian script tidak perlu diubah
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
            "http://donasi-dm.test/storage/donaturs/";
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
