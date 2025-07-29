<template>
  <div>
    <div v-if="categories.length > 0">
      <div
        class="mt-5 grid grid-cols-4 gap-4 md:gap-4 text-center items-center"
      >
        <div
          v-for="category in categories"
          :key="category.id"
          class="col-span-2 md:col-span-2 lg:col-span-1 bg-white rounded-md shadow-md p-4 text-center text-xs h-28"
        >
          <router-link
            :to="{ name: 'category.show', params: { slug: category.slug } }"
            class="flex flex-col items-center justify-center h-full"
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
        <div
          class="col-span-2 md:col-span-1 lg:col-span-1 bg-white rounded-md shadow-md p-4 text-center text-xs h-28"
        >
          <router-link
            :to="{ name: 'category.index' }"
            class="flex flex-col items-center justify-center h-full"
          >
            <div>
              <img
                src="../assets/images/menu.png"
                width="40"
                class="inline-block mb-2"
              />
            </div>
            LAINNYA
          </router-link>
        </div>
      </div>
    </div>
    <div v-else>
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
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { ContentLoader } from "vue-content-loader";

export default {
  name: "CategoryHomeComponent",
  components: {
    ContentLoader,
  },
  setup() {
    const store = useStore();
    onMounted(() => {
      store.dispatch("category/getCategoryHome");
    });

    const categories = computed(() => {
      return store.state.category.categories.map((category) => {
        const LARAVEL_BASE_URL = "http://donasi-dm.test"; // ADJUST THIS

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
            imageUrl = `${LARAVEL_BASE_URL}/storage/category_icons/${category.image}`;
          }
        }

        return {
          ...category,
          imageComputed: imageUrl,
        };
      });
    });

    return {
      categories,
    };
  },
};
</script>

<style>
/* You can add custom styles here if needed, or leave it empty if fully using Tailwind */
</style>
