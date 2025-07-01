<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div v-if="campaigns.length > 0">
        <div class="mt-5">
          <div v-for="campaign in campaigns" :key="campaign.id" class="mb-4">
            <router-link
              :to="{
                name: 'campaign.show',
                params: { slug: campaign.slug },
              }"
              class="block"
            >
              <div class="bg-white rounded-md shadow-md p-3">
                <div class="flex rounded-xl space-x-4">
                  <img
                    class="w-32 h-32 rounded object-cover flex-shrink-0"
                    :src="campaign.imageComputed"
                    alt="Campaign Image"
                  />
                  <div class="w-full text-left space-y-1">
                    <p class="text-sm font-semibold text-gray-800">
                      {{ campaign.title }}
                    </p>
                    <div class="font-medium">
                      <div class="mt-1 text-gray-500 text-xs">
                        {{ campaign.user.name }}
                      </div>
                      <div v-if="campaign.sum_donation.length > 0">
                        <div
                          v-for="donation in campaign.sum_donation"
                          :key="donation.id"
                        >
                          <div class="relative pt-1">
                            <div
                              class="overflow-hidden h-2 mb-2 text-xs flex rounded bg-blue-200"
                            >
                              <div
                                :style="{
                                  width:
                                    percentage(
                                      donation.total,
                                      campaign.target_donation
                                    ) + '%',
                                }"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                              ></div>
                            </div>
                          </div>
                          <p class="text-xs text-gray-500">
                            <span class="font-bold text-blue-400"
                              >Rp. {{ formatPrice(donation.total) }}
                            </span>
                          </p>
                        </div>
                      </div>
                      <div v-else>
                        <div class="relative pt-1">
                          <div
                            class="overflow-hidden h-2 mb-2 text-xs flex rounded bg-blue-200"
                          >
                            <div
                              style="width: 0%"
                              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                          </div>
                        </div>
                        <p class="text-xs text-gray-500">
                          <span class="font-bold text-blue-400">Rp. 0 </span>
                        </p>
                      </div>
                      <div class="mt-2 text-xs flex justify-between">
                        <span class="text-gray-500">
                          Terkumpul dari
                          <strong
                            >Rp.
                            {{ formatPrice(campaign.target_donation) }}</strong
                          >
                        </span>
                        <span class="font-bold"
                          >{{ countDay(campaign.max_date) }} hari lagi</span
                        >
                      </div>
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
import { FacebookLoader } from "vue-content-loader";

export default {
  name: "CampaignIndexComponent",
  components: {
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
<style></style>
