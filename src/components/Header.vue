<template>
  <div>
    <!-- header -->
    <header>
      <div
        class="bg-gray-700 text-white text-center fixed inset-x-0 top-0 z-10"
      >
        <div
          class="container mx-auto grid grid-cols-10 p-3 sm:w-full md:w-5/12"
        >
          <div class="col-span-2 h-ful w-15 p-1 mr-3">
            <!-- CHANGE TO router-link -->
            <router-link :to="{ name: 'home' }">
              <img
                src="../assets/images/logo-DM-white.png"
                class="inline-block"
              />
            </router-link>
          </div>
          <div class="col-span-8">
            <input
              type="text"
              @click="linkToSearch"
              v-model="search"
              @keyup="searchQuery"
              class="appearance-none w-full bg-gray-500 rounded-full h-7 shadow-md placeholder-white focus:outline-none focus:placeholder-gray-600 focus:bg-white focus-within:text-gray-600 p-5"
              placeholder="Cari yang ingin kamu bantu"
            />
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
//hook vue
import { ref } from "vue";
//hook vue router
import { useRouter } from "vue-router";
//hook vuex
import { useStore } from "vuex";

export default {
  name: "HeaderComponent",
  setup() {
    //router
    const router = useRouter();
    //store
    const store = useStore();

    //state search
    const search = ref(null);

    /**
     * Fungsi yang dipicu setiap kali ada input pada form pencarian.
     * Ini akan mendispatch aksi pencarian ke Vuex.
     */
    function searchQuery() {
      // Dispatch aksi 'searchCampaign' di module 'campaign' dengan nilai input pencarian
      store.dispatch("campaign/searchCampaign", search.value);
    }

    //redirect to route search
    function linkToSearch() {
      router.push({
        name: "search",
      });
    }

    return {
      search,
      linkToSearch,
      searchQuery,
    };
  },
};
</script>

<style></style>
