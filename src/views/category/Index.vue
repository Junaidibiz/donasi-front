<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-5 sm:w-full md:w-5/12">
      <div v-if="categories.length > 0">
        <div class="grid grid-cols-4 gap-4 md:gap-4 text-center items-center">
          <div
            v-for="category in categories"
            :key="category.id"
            class="col-span-2 md:col-span-2 lg:col-span-2 bg-white rounded-md shadow-md p-4 text-center text-xs"
          >
            <!-- Link to category detail -->
            <router-link
              :to="{ name: 'category.show', params: { slug: category.slug } }"
            >
              <div>
                <img
                  :src="category.imageComputed"
                  width="40"
                  class="inline-block mb-2"
                />
              </div>
              {{ category.name.toUpperCase() }}
            </router-link>
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
            class="sm:col-span-2 md:col-span-1 lg:col-span-1 bg-white rounded-md shadow-md text-center text-xs"
          >
            <ContentLoader />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { ContentLoader } from "vue-content-loader";

export default {
  name: "CategoryIndexComponent",
  components: {
    ContentLoader, // Register content loader
  },
  setup() {
    const store = useStore();
    // onMounted will run "getCategory" action in "category" module
    onMounted(() => {
      store.dispatch("category/getCategory");
    });

    // Used to get "categories" state data in "category" module
    const categories = computed(() => {
      // Map category data to add imageComputed property
      return store.state.category.categories.map((category) => {
        const LARAVEL_BASE_URL = "http://donasi-dm.test"; // ADJUST THIS WITH YOUR BACKEND DOMAIN BASE URL

        let imageUrl;
        if (
          category.image.startsWith("http://") ||
          category.image.startsWith("https://")
        ) {
          imageUrl = category.image;
        } else {
          if (category.image.startsWith("/storage")) {
            imageUrl = `${LARAVEL_BASE_URL}${category.image}`;
          } else {
            // Assume path in database is relative to public/storage/ (e.g. 'category_icons/icon.png')
            imageUrl = `${LARAVEL_BASE_URL}/storage/category_icons/${category.image}`; // Adjust folder if different
          }
        }

        return {
          ...category,
          imageComputed: imageUrl,
        };
      });
    });

    return {
      categories, // Return categories state
    };
  },
};
</script>

<style>
/* You can add custom styles here if needed, or leave it empty if fully using Tailwind */
</style>
