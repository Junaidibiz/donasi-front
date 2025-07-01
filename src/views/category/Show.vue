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
            class="mb-4"
          >
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

    return {
      category,
      campaignCategory,
    };
  },
};
</script>

<style></style>
