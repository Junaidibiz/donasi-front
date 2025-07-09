<template>
  <div class="pb-20 pt-24">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div v-if="campaigns && campaigns.length > 0">
        <div class="mt-2 space-y-4">
          <div v-for="campaign in campaigns" :key="campaign.id">
            <router-link
              :to="{
                name: 'campaign.show',
                params: { slug: campaign.slug },
              }"
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
        <div class="mb-3 bg-blue-100 text-blue-900 p-4 rounded-md">
          Ketik untuk mencari campaign...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Bagian script ini sama persis dengan kode Anda yang sudah berjalan
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "SearchComponent",
  setup() {
    const store = useStore();

    const campaigns = computed(() => {
      const fetchedCampaigns = Array.isArray(store.state.campaign.campaigns)
        ? store.state.campaign.campaigns
        : [];
      return fetchedCampaigns.map((campaign) => {
        const LARAVEL_BASE_URL = "http://donasi-dm.test";
        let imageUrl;
        if (campaign.image) {
          if (
            campaign.image.startsWith("http://") ||
            campaign.image.startsWith("https://")
          ) {
            imageUrl = campaign.image;
          } else if (campaign.image.startsWith("/storage")) {
            imageUrl = `${LARAVEL_BASE_URL}${campaign.image}`;
          } else {
            imageUrl = `${LARAVEL_BASE_URL}/storage/campaigns/${campaign.image}`;
          }
        } else {
          imageUrl = "https://placehold.co/300x200/e2e8f0/e2e8f0";
        }
        return {
          ...campaign,
          imageComputed: imageUrl,
          user: campaign.user || {},
          sum_donation: campaign.sum_donation || [],
        };
      });
    });

    return {
      campaigns,
    };
  },
};
</script>
