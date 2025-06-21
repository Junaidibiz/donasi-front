<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-5 sm:w-full md:w-5/12">
      <div v-if="campaignCategory.length > 0">
        <h3>
          <i class="fa fa-list-ul"></i> KATEGORI
          <strong>{{
            category.name ? category.name.toUpperCase() : ""
          }}</strong>
        </h3>
        <div class="mt-5">
          <div
            v-for="campaign in campaignCategory"
            :key="campaign.id"
            class="grid grid-cols-4 gap-4 mb-4"
          >
            <div class="col-span-4">
              <div class="bg-white rounded-md shadow-md p-2">
                <div class="md:flex rounded-xl md:p-0">
                  <img
                    class="w-full h-34 md:w-56 rounded object-cover"
                    :src="campaign.imageComputed"
                    width="384"
                    height="512"
                  />
                  <div
                    class="pt-6 p-5 md:p-3 text-center md:text-left space-y-4"
                  >
                    <!-- CHANGE TO router-link for campaign detail -->
                    <router-link
                      :to="{
                        name: 'campaign.show',
                        params: { slug: campaign.slug },
                      }"
                    >
                      <p class="text-sm font-semibold">
                        {{ campaign.title }}
                      </p>
                    </router-link>
                    <div class="font-medium">
                      <div class="mt-3 text-gray-500 text-xs">
                        {{ campaign.user.name }}
                      </div>
                      <div v-if="campaign.sum_donation.length > 0">
                        <div
                          v-for="donation in campaign.sum_donation"
                          :key="donation.id"
                        >
                          <div class="relative pt-1">
                            <div
                              class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200"
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
                            terkumpul dari
                            <span class="font-bold"
                              >Rp.
                              {{ formatPrice(campaign.target_donation) }}</span
                            >
                          </p>
                        </div>
                      </div>
                      <div v-else>
                        <div class="relative pt-1">
                          <div
                            class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200"
                          >
                            <div
                              :style="{
                                width:
                                  percentage(0, campaign.target_donation) + '%',
                              }"
                              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                          </div>
                        </div>
                        <p class="text-xs text-gray-500">
                          <span class="font-bold text-blue-400">Rp. 0 </span>
                          terkumpul dari
                          <span class="font-bold"
                            >Rp.
                            {{ formatPrice(campaign.target_donation) }}</span
                          >
                        </p>
                      </div>
                      <div class="mt-3 text-xs">
                        <strong>{{ countDay(campaign.max_date) }}</strong> hari
                        lagi
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="mb-3 bg-red-500 text-white p-4 rounded-md">
          Data Campaign Berdasarkan Kategori
          <strong>{{ category.name ? category.name : "" }}</strong> Belum
          Tersedia!
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default {
  name: "CategoryShowComponent",
  setup() {
    const store = useStore();
    const route = useRoute();

    onMounted(() => {
      store.dispatch("category/getDetailCategory", route.params.slug);
    });

    const category = computed(() => {
      return store.state.category.category;
    });

    const campaignCategory = computed(() => {
      return store.state.category.campaignCategory.map((campaign) => {
        const LARAVEL_BASE_URL = "http://donasi-dm.test"; // ADJUST THIS

        let imageUrl;
        if (
          campaign.image.startsWith("http://") ||
          campaign.image.startsWith("https://")
        ) {
          imageUrl = campaign.image;
        } else {
          if (campaign.image.startsWith("/storage")) {
            imageUrl = `${LARAVEL_BASE_URL}${campaign.image}`;
          } else {
            imageUrl = `${LARAVEL_BASE_URL}/storage/campaigns/${campaign.image}`;
          }
        }

        return {
          ...campaign,
          imageComputed: imageUrl,
        };
      });
    });

    return {
      category,
      campaignCategory,
    };
  },
};
</script>

<style>
/* You can add custom styles here if needed, or leave it empty if fully using Tailwind */
</style>
