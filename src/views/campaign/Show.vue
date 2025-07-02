<template>
  <div class="bg-white sm:bg-transparent pb-20 pt-24">
    <div
      v-if="campaign && Object.keys(campaign).length > 0"
      class="max-w-2xl mx-auto bg-white sm:shadow-lg sm:rounded-2xl overflow-hidden p-4 sm:p-6"
    >
      <div
        class="h-56 bg-gray-200 flex items-center justify-center rounded-xl overflow-hidden"
      >
        <img
          :src="campaignImageComputed"
          :alt="campaign.title"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div class="pt-5">
        <div v-if="user" class="flex items-center gap-2 text-sm mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 text-blue-500"
          >
            <path
              fill-rule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="font-medium text-gray-600">{{ user.name }}</span>
        </div>

        <h1 class="text-xl font-bold mb-3">{{ campaign.title }}</h1>

        <div v-if="sumDonation && sumDonation.length > 0">
          <div v-for="donation in sumDonation" :key="donation.id">
            <div class="text-green-600 text-xl font-bold">
              Rp {{ formatPrice(donation.total) }}
            </div>
            <div class="text-sm text-gray-500 mb-2">
              Terkumpul dari Rp {{ formatPrice(campaign.target_donation) }}
            </div>
            <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                class="bg-green-500 h-2"
                :style="{
                  width:
                    percentage(donation.total, campaign.target_donation) + '%',
                }"
              ></div>
            </div>
            <div class="flex justify-between text-xs text-gray-500 mt-1 mb-5">
              <span
                >{{
                  Math.floor(
                    percentage(donation.total, campaign.target_donation)
                  )
                }}%</span
              >
              <span>{{ countDay(campaign.max_date) }} Hari Lagi</span>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="text-green-600 text-xl font-bold">Rp 0</div>
          <div class="text-sm text-gray-500 mb-2">
            Terkumpul dari Rp {{ formatPrice(campaign.target_donation) }}
          </div>
          <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div class="bg-green-500 h-2" style="width: 0%"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1 mb-5">
            <span>0%</span>
            <span>{{ countDay(campaign.max_date) }} Hari Lagi</span>
          </div>
        </div>

        <div v-if="campaign.max_date && maxDate(campaign.max_date) == true">
          <div
            class="block w-full text-center bg-gray-400 text-white font-semibold py-3 rounded-xl cursor-not-allowed mb-6"
          >
            Donasi Ditutup
          </div>
        </div>
        <router-link
          v-else
          :to="{ name: 'donation.create', params: { slug: campaign.slug } }"
          class="block w-full text-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl mb-6 transition duration-200"
        >
          Donasi Sekarang!
        </router-link>
      </div>

      <div>
        <h2 class="text-base font-semibold mb-2">Cerita</h2>
        <div
          class="text-sm text-gray-700 leading-relaxed mb-6 prose max-w-none"
          v-html="processedDescription"
        ></div>
      </div>

      <div class="pb-6">
        <h2 class="text-base font-semibold mb-3">
          Donasi ({{ donations.length }})
        </h2>
        <div v-if="donations.length > 0" class="space-y-4">
          <div
            v-for="donation in donations"
            :key="donation.id"
            class="bg-gray-100 rounded-xl p-4 flex gap-4 items-start"
          >
            <img
              :src="getDonationDonaturAvatar(donation.donatur)"
              class="w-10 h-10 rounded-full shrink-0 object-cover"
            />
            <div>
              <span class="font-semibold text-sm">{{
                donation.donatur.name
              }}</span>
              <div class="text-green-600 text-sm font-medium mt-1">
                Berdonasi sebesar: Rp {{ formatPrice(donation.amount) }}
              </div>
              <p class="text-sm text-gray-600 mt-1 italic">
                "{{ donation.pray }}"
              </p>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-sm text-gray-500 py-4">
          Jadilah orang pertama yang berdonasi di campaign ini!
        </div>
      </div>
    </div>

    <div
      v-else
      class="max-w-2xl mx-auto bg-white sm:shadow-lg sm:rounded-2xl overflow-hidden p-4 sm:p-6"
    >
      <FacebookLoader class="h-96" />
    </div>
  </div>
</template>

<script>
// Bagian script tidak perlu diubah, sudah sesuai dengan pola global mixin
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { FacebookLoader } from "vue-content-loader";

export default {
  name: "CampaignShowComponent",
  components: {
    FacebookLoader,
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    onMounted(() => {
      store.dispatch("campaign/getDetailCampaign", route.params.slug);
    });

    const campaign = computed(() => store.state.campaign.campaign);
    const user = computed(() => store.state.campaign.user);
    const sumDonation = computed(() => store.state.campaign.sumDonation || []);
    const donations = computed(() => store.state.campaign.donations || []);

    const campaignImageComputed = computed(() => {
      const LARAVEL_BASE_URL = "http://donasi-dm.test";
      if (campaign.value && campaign.value.image) {
        const imagePath = campaign.value.image;
        if (
          imagePath.startsWith("http://") ||
          imagePath.startsWith("https://")
        ) {
          return imagePath;
        } else if (imagePath.startsWith("/storage")) {
          return `${LARAVEL_BASE_URL}${imagePath}`;
        } else {
          return `${LARAVEL_BASE_URL}/storage/campaigns/${imagePath}`;
        }
      }
      return "https://placehold.co/600x400/e2e8f0/e2e8f0?text=No+Image";
    });

    const getDonationDonaturAvatar = (donatur) => {
      if (donatur && donatur.name) {
        if (donatur.profile_photo_url) {
          return donatur.profile_photo_url;
        } else if (donatur.avatar) {
          const LARAVEL_STORAGE_BASE_URL =
            "http://donasi-dm.test/storage/donaturs/";
          if (
            donatur.avatar.startsWith("http://") ||
            donatur.avatar.startsWith("https://")
          ) {
            return donatur.avatar;
          } else {
            return `${LARAVEL_STORAGE_BASE_URL}${donatur.avatar}`;
          }
        } else {
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            donatur.name || "D"
          )}&background=random&color=fff&size=128`;
        }
      }
      return "";
    };

    const processedDescription = computed(() => {
      let description = campaign.value.description;
      if (!description) return "";
      const LARAVEL_BASE_URL = "http://donasi-dm.test";
      const regex = /<img[^>]+src="([^"]+)"/g;
      return description.replace(regex, (match, src) => {
        if (src.startsWith("http://") || src.startsWith("https://")) {
          return match;
        } else if (src.startsWith("/storage")) {
          return match.replace(src, `${LARAVEL_BASE_URL}${src}`);
        } else {
          return match.replace(src, `${LARAVEL_BASE_URL}/storage/${src}`);
        }
      });
    });

    return {
      campaign,
      campaignImageComputed,
      user,
      getDonationDonaturAvatar,
      sumDonation,
      donations,
      processedDescription,
      route,
    };
  },
};
</script>
