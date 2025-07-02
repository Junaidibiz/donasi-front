<template>
  <div class="pb-20 pt-24">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div class="grid grid-cols-1 bg-white rounded shadow-md p-1 text-sm mb-5">
        <SliderComponent />
      </div>

      <div class="flex justify-between items-center mt-5 mb-2">
        <h3 class="text-lg font-bold text-gray-800">Kategori Populer</h3>
        <router-link
          :to="{ name: 'category.index' }"
          class="text-damu-600 font-semibold text-sm"
        >
          Lihat Semua
        </router-link>
      </div>

      <CategoryHomeComponent />

      <div class="flex justify-between items-center mt-8 mb-2">
        <h3 class="text-lg font-bold text-gray-800">Campaign Terbaru</h3>
        <router-link
          :to="{ name: 'campaign.index' }"
          class="text-damu-600 font-semibold text-sm"
        >
          Lihat Semua
        </router-link>
      </div>

      <div v-if="campaigns.length > 0">
        <div class="mt-2 space-y-4">
          <div v-for="campaign in campaigns" :key="campaign.id">
            <router-link
              :to="{ name: 'campaign.show', params: { slug: campaign.slug } }"
              class="block"
            >
              <div
                class="bg-white shadow-md rounded-lg p-4 w-full flex flex-col md:flex-row gap-4 items-start"
              >
                <div class="w-full md:w-1/3">
                  <img
                    :src="campaign.imageComputed"
                    :alt="campaign.title"
                    class="w-full h-40 object-cover rounded-lg"
                  />
                </div>

                <div class="flex-1 space-y-2 w-full">
                  <h2 class="text-sm font-semibold text-gray-800 leading-snug">
                    {{ campaign.title }}
                  </h2>

                  <div v-if="campaign.sum_donation.length > 0">
                    <div
                      v-for="donation in campaign.sum_donation"
                      :key="donation.id"
                    >
                      <p class="text-green-600 font-bold text-sm">
                        Rp {{ formatPrice(donation.total) }}
                      </p>
                      <p class="text-xs text-gray-600">
                        Terkumpul dari
                        <strong
                          >Rp
                          {{ formatPrice(campaign.target_donation) }}</strong
                        >
                      </p>
                      <div class="w-full bg-gray-200 h-3 rounded-full mt-2">
                        <div
                          class="bg-green-500 h-full rounded-full"
                          :style="{
                            width:
                              percentage(
                                donation.total,
                                campaign.target_donation
                              ) + '%',
                          }"
                        ></div>
                      </div>
                      <div
                        class="flex justify-between text-xs font-medium text-gray-700 mt-1"
                      >
                        <span class="text-green-600"
                          >{{
                            Math.floor(
                              percentage(
                                donation.total,
                                campaign.target_donation
                              )
                            )
                          }}% Target Tercapai</span
                        >
                        <span>{{ countDay(campaign.max_date) }} Hari Lagi</span>
                      </div>
                    </div>
                  </div>
                  <div v-else>
                    <p class="text-green-600 font-bold text-sm">Rp 0</p>
                    <p class="text-xs text-gray-600">
                      Terkumpul dari
                      <strong
                        >Rp {{ formatPrice(campaign.target_donation) }}</strong
                      >
                    </p>
                    <div class="w-full bg-gray-200 h-3 rounded-full mt-2">
                      <div
                        class="bg-green-500 h-full rounded-full"
                        style="width: 0%"
                      ></div>
                    </div>
                    <div
                      class="flex justify-between text-xs font-medium text-gray-700 mt-1"
                    >
                      <span class="text-green-600">0% Target Tercapai</span>
                      <span>{{ countDay(campaign.max_date) }} Hari Lagi</span>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          v-for="index in 2"
          :key="index"
          class="grid grid-cols-1 bg-white rounded shadow-md p-3 text-sm mt-4 mb-4"
        >
          <FacebookLoader class="h-24" />
        </div>
      </div>
      <div class="text-center mt-4 mb-4" v-show="nextExists">
        <a
          @click="loadMore"
          class="bg-gray-700 text-white p-2 px-3 rounded-md shadow-md focus:outline-none focus:bg-gray-900 cursor-pointer"
        >
          LIHAT SEMUA <i class="fa fa-long-arrow-alt-right"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import SliderComponent from "../../components/Slider.vue";
import CategoryHomeComponent from "../../components/CategoryHome.vue";
import { FacebookLoader } from "vue-content-loader";

export default {
  name: "HomeComponent",
  components: {
    SliderComponent,
    CategoryHomeComponent,
    FacebookLoader,
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch("campaign/getCampaign");
    });

    const campaigns = computed(() => {
      return store.state.campaign.campaigns.map((campaign) => {
        const LARAVEL_BASE_URL = "http://donasi-dm.test";

        let imageUrl;
        if (
          campaign.image &&
          (campaign.image.startsWith("http://") ||
            campaign.image.startsWith("https://"))
        ) {
          imageUrl = campaign.image;
        } else if (campaign.image && campaign.image.startsWith("/storage")) {
          imageUrl = `${LARAVEL_BASE_URL}${campaign.image}`;
        } else if (campaign.image) {
          imageUrl = `${LARAVEL_BASE_URL}/storage/campaigns/${campaign.image}`;
        } else {
          imageUrl = `https://placehold.co/300x300/e2e8f0/e2e8f0`;
        }

        return {
          ...campaign,
          imageComputed: imageUrl,
        };
      });
    });

    const nextExists = computed(() => {
      return store.state.campaign.nextExists;
    });
    const nextPage = computed(() => {
      return store.state.campaign.nextPage;
    });

    function loadMore() {
      store.dispatch("campaign/getLoadMore", nextPage.value);
    }

    return {
      campaigns,
      nextExists,
      nextPage,
      loadMore,
    };
  },
};
</script>
<style>
/* You can add custom styles here if needed, or leave it empty if fully using Tailwind */
</style>
