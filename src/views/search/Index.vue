<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div v-if="campaigns && campaigns.length > 0">
        <div class="mt-5">
          <div v-for="campaign in campaigns" :key="campaign.id" class="mb-4">
            <router-link
              :to="{ name: 'campaign.show', params: { slug: campaign.slug } }"
              class="block"
            >
              <div class="bg-white rounded-md shadow-md p-3">
                <div class="flex rounded-xl space-x-4">
                  <img
                    class="w-32 h-32 rounded object-cover flex-shrink-0"
                    :src="campaign.imageComputed"
                    :alt="campaign.title"
                    onerror="this.onerror=null;this.src='https://placehold.co/300x300/e2e8f0/e2e8f0';"
                  />
                  <div class="w-full text-left space-y-1">
                    <p class="text-sm font-semibold text-gray-800">
                      {{ campaign.title }}
                    </p>
                    <div class="font-medium">
                      <div class="mt-1 text-gray-500 text-xs">
                        {{ campaign.user.name }}
                      </div>
                      <div
                        v-if="
                          campaign.sum_donation &&
                          campaign.sum_donation.length > 0
                        "
                      >
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
                              >Rp. {{ formatPrice(donation.total) }}</span
                            >
                            terkumpul dari Rp.
                            {{ formatPrice(campaign.target_donation) }}
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
                          <span class="font-bold text-blue-400">Rp. 0</span>
                          terkumpul dari Rp.
                          {{ formatPrice(campaign.target_donation) }}
                        </p>
                      </div>
                      <div class="mt-2 text-xs text-right">
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
        <div class="mb-3 bg-red-500 text-white p-4 rounded-md">
          Ketik untuk mencari campaign...
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
// Mixin TIDAK PERLU diimpor di sini

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
          imageUrl = "https://placehold.co/300x300/e2e8f0/e2e8f0";
        }
        return {
          ...campaign,
          imageComputed: imageUrl,
          user: campaign.user || {},
          sum_donation: campaign.sum_donation || [],
        };
      });
    });

    // KITA TIDAK PERLU MENGEMBALIKAN FUNGSI DARI MIXIN
    return {
      campaigns,
    };
  },
};
</script>
