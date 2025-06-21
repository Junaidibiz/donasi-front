<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-5 sm:w-full md:w-5/12">
      <div v-if="campaign.id">
        <!-- Check if campaign data is loaded -->
        <div class="bg-white rounded-md shadow-md p-2 mb-5">
          <img
            class="w-full h-56 rounded object-cover"
            :src="campaign.imageComputed"
            width="384"
            height="512"
          />
          <!-- Display campaign image -->

          <div class="p-3">
            <h3 class="text-xl font-semibold">{{ campaign.title }}</h3>
            <!-- Display campaign title -->
            <p class="text-xs text-gray-500 mt-2">{{ campaign.user.name }}</p>
            <!-- Display user name -->

            <div v-if="campaign.sum_donation.length > 0">
              <div v-for="donation in campaign.sum_donation" :key="donation.id">
                <div class="relative pt-1 mt-3">
                  <div
                    class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200"
                  >
                    <div
                      :style="{
                        width:
                          percentage(donation.total, campaign.target_donation) +
                          '%',
                      }"
                      class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                    ></div>
                  </div>
                </div>
                <p class="text-xs text-gray-500">
                  <span class="font-bold text-blue-400"
                    >Rp. {{ formatPrice(donation.total) }}
                  </span>
                  terkumpul dari
                  <span class="font-bold"
                    >Rp. {{ formatPrice(campaign.target_donation) }}</span
                  >
                </p>
              </div>
            </div>
            <div v-else>
              <div class="relative pt-1 mt-3">
                <div
                  class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200"
                >
                  <div
                    :style="{
                      width: percentage(0, campaign.target_donation) + '%',
                    }"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
              <p class="text-xs text-gray-500">
                <span class="font-bold text-blue-400">Rp. 0 </span> terkumpul
                dari
                <span class="font-bold"
                  >Rp. {{ formatPrice(campaign.target_donation) }}</span
                >
              </p>
            </div>

            <div class="mt-3 text-xs">
              <strong>{{ countDay(campaign.max_date) }}</strong> hari lagi
            </div>

            <div class="border-2 border-gray-200 mt-3 mb-2"></div>

            <!-- Campaign Description -->
            <p class="text-sm text-gray-600" v-html="campaign.description"></p>
          </div>
        </div>
      </div>
      <div v-else>
        <!-- Loading state -->
        <div
          class="grid grid-cols-1 bg-white rounded shadow-md p-3 text-sm mt-4 mb-4"
        >
          <FacebookLoader class="h-24" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//hook vue
import { onMounted, computed } from "vue";
//hook vuex
import { useStore } from "vuex";
//hook vue router
import { useRoute } from "vue-router"; // Import useRoute to get slug from URL
// vue content loader
import { FacebookLoader } from "vue-content-loader";

export default {
  name: "CampaignShowComponent",
  components: {
    FacebookLoader,
  },
  setup() {
    //store vuex
    const store = useStore();
    //get current route to access params
    const route = useRoute();

    //onMounted will run "getDetailCampaign" action in "campaign" module
    onMounted(() => {
      // Dispatch action to get campaign details using the slug from the URL
      store.dispatch("campaign/getDetailCampaign", route.params.slug);
    });

    // Get campaign data from Vuex state
    const campaign = computed(() => {
      // KOREKSI: Map data campaign untuk menambahkan properti imageComputed (sama seperti di Home.vue)
      // Pastikan store.state.campaign.campaign itu objek, bukan array, karena ini detail
      const fetchedCampaign = store.state.campaign.campaign;
      if (!fetchedCampaign || !fetchedCampaign.id) {
        // Return empty object if data not fetched yet
        return {};
      }

      const LARAVEL_BASE_URL = "http://donasi-dm.test"; // <-- SESUAIKAN DENGAN BASE URL DOMAIN BACKEND ANDA

      let imageUrl;
      if (
        fetchedCampaign.image &&
        (fetchedCampaign.image.startsWith("http://") ||
          fetchedCampaign.image.startsWith("https://"))
      ) {
        imageUrl = fetchedCampaign.image;
      } else if (fetchedCampaign.image) {
        if (fetchedCampaign.image.startsWith("/storage")) {
          imageUrl = `${LARAVEL_BASE_URL}${fetchedCampaign.image}`;
        } else {
          // Assume path in database is relative to public/storage/campaigns/ (e.g. 'campaigns/image.png')
          imageUrl = `${LARAVEL_BASE_URL}/storage/campaigns/${fetchedCampaign.image}`; // <-- Adjust folder if different
        }
      } else {
        // Fallback if no image from backend
        imageUrl = "https://placehold.co/384x512/E0E0E0/333333?text=No+Image"; // Placeholder image
      }

      return {
        ...fetchedCampaign,
        imageComputed: imageUrl,
      };
    });

    return {
      campaign, // return campaign state
    };
  },
};
</script>

<style>
/* Anda dapat menambahkan gaya khusus di sini jika diperlukan, atau biarkan kosong jika sepenuhnya menggunakan Tailwind */
</style>
