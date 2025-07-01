<template>
  <div>
    <header>
      <div
        class="bg-damu-700 text-white text-center fixed inset-x-0 top-0 z-10"
      >
        <div
          class="container mx-auto grid grid-cols-10 p-3 sm:w-full md:w-5/12"
        >
          <div class="col-span-4 flex items-center">
            <router-link :to="{ name: 'home' }">
              <img
                src="../assets/images/logo-DM-white.png"
                class="inline-block w-24"
              />
            </router-link>
          </div>
          <div class="col-span-6 flex items-center">
            <input
              type="text"
              @click="linkToSearch"
              v-model="search"
              @keyup="searchQuery"
              class="appearance-none w-full bg-damu-800 rounded-full shadow-md placeholder-white focus:outline-none focus:placeholder-gray-200 focus:bg-white focus-within:text-gray-600 py-3 px-5"
              placeholder="Cari yang ingin kamu bantu"
            />
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
// ================= AWAL PERUBAHAN =================
// Impor 'watch' dari Vue dan 'useRoute' dari Vue Router
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
// ================= AKHIR PERUBAHAN =================

export default {
  name: "HeaderComponent",
  setup() {
    // ================= AWAL PERUBAHAN =================
    // Inisialisasi route
    const route = useRoute();
    // ================= AKHIR PERUBAHAN =================

    const router = useRouter();
    const store = useStore();
    const search = ref(null);

    function searchQuery() {
      store.dispatch("campaign/searchCampaign", search.value);
    }

    function linkToSearch() {
      router.push({
        name: "search",
      });
    }

    // ================= AWAL PERUBAHAN =================
    // Mengawasi perubahan pada nama route
    watch(
      () => route.name,
      (newRouteName) => {
        // Jika nama route yang baru adalah 'home', maka kosongkan pencarian
        if (newRouteName === "home") {
          search.value = null;
        }
      }
    );
    // ================= AKHIR PERUBAHAN =================

    return {
      search,
      linkToSearch,
      searchQuery,
    };
  },
};
</script>

<style></style>
