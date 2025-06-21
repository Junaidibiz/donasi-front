<template>
  <div>
    <div v-if="categories.length > 0">
      <div
        class="mt-5 grid grid-cols-4 gap-4 md:gap-4 text-center items-center"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          class="col-span-2 md:col-span-2 lg:col-span-1 bg-white rounded-md shadow-md p-4 text-center text-xs"
        >
          <a href="#">
            <!-- LINK INI NANTI BISA DIARAHKAN KE HALAMAN DETAIL KATEGORI -->
            <div>
              <img
                :src="category.imageComputed"
                width="40"
                class="inline-block mb-2"
              />
            </div>
            {{ category.name.toUpperCase() }}
          </a>
        </div>
        <!-- Card "LAINNYA" -->
        <div
          class="col-span-2 md:col-span-1 lg:col-span-1 bg-white rounded-md shadow-md p-4 text-center text-xs"
        >
          <a href="#">
            <!-- LINK INI NANTI BISA DIARAHKAN KE HALAMAN SEMUA KATEGORI -->
            <div>
              <img
                src="../assets/images/menu.png"
                width="40"
                class="inline-block mb-2"
              />
            </div>
            LAINNYA
          </a>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- Loading block for categories -->
      <div
        class="mt-5 grid grid-cols-4 gap-4 md:gap-4 text-center items-center"
      >
        <div
          v-for="index in 4"
          :key="index"
          class="sm:col-span-2 md:col-span-2 lg:col-span-2 bg-white rounded-md shadow-md text-center text-xs"
        >
          <ContentLoader />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//hook vue
import { computed, onMounted } from "vue";
//vuex
import { useStore } from "vuex";
//vue content loader
import { ContentLoader } from "vue-content-loader";

export default {
  name: "CategoryHomeComponent",
  components: {
    ContentLoader, // <-- register content loader
  },
  setup() {
    //store vuex
    const store = useStore();
    //onMounted will run "getCategoryHome" action in "category" module
    onMounted(() => {
      store.dispatch("category/getCategoryHome");
    });

    //used to get "categories" state data in "category" module
    const categories = computed(() => {
      // KOREKSI: Map data category untuk menambahkan properti imageComputed
      return store.state.category.categories.map((category) => {
        // !!! PENTING: SESUAIKAN BASE URL STORAGE LARAVEL ANDA DI SINI !!!
        // Contoh: 'http://localhost:8000/' jika kategori image disimpan di public_path()
        // Atau 'http://donasi-dm.test/storage/categories/' jika disimpan di storage/app/public/categories/
        const LARAVEL_BASE_URL = "http://donasi-dm.test"; // <-- SESUAIKAN DENGAN BASE URL DOMAIN BACKEND ANDA

        // Jika path gambar adalah relatif (misal '/categories/icon.png'), tambahkan base URL domain
        const imageUrl = category.image.startsWith("/")
          ? `${LARAVEL_BASE_URL}${category.image}`
          : category.image;
        return {
          ...category,
          imageComputed: imageUrl,
        };
      });
    });

    return {
      categories, // <-- categories
    };
  },
};
</script>

<style>
/* Anda dapat menambahkan gaya khusus di sini jika diperlukan, atau biarkan kosong jika sepenuhnya menggunakan Tailwind */
</style>
