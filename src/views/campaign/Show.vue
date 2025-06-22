<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div
        v-if="campaign && Object.keys(campaign).length > 0"
        class="bg-white rounded-md shadow-md p-3"
      >
        <img
          class="rounded-md w-full"
          :src="campaignImageComputed"
          :alt="campaign.title"
        />

        <div class="mt-5">
          <p class="text-lg font-semibold">
            {{ campaign.title }}
          </p>
        </div>

        <div v-if="sumDonation && sumDonation.length > 0">
          <div v-for="donation in sumDonation" :key="donation.id">
            <p class="mt-4 text-base text-gray-500">
              <span class="font-bold text-blue-400"
                >Rp. {{ formatPrice(donation.total) }}
              </span>
              terkumpul dari
              <span class="font-bold"
                >Rp. {{ formatPrice(campaign.target_donation) }}</span
              >
            </p>

            <div class="relative pt-1 mt-2">
              <div
                class="overflow-hidden h-2 mb-4 text-base flex rounded bg-blue-200"
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
          </div>
        </div>
        <div v-else>
          <p class="mt-4 text-base text-gray-500">
            <span class="font-bold text-blue-400">Rp. 0 </span> terkumpul dari
            <span class="font-bold"
              >Rp. {{ formatPrice(campaign.target_donation) }}</span
            >
          </p>

          <div class="relative pt-1 mt-2">
            <div
              class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200"
            >
              <div
                :style="{
                  width: campaign.target_donation
                    ? percentage(0, campaign.target_donation) + '%'
                    : '0%',
                }"
                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
          </div>
        </div>

        <div class="mt-3">
          <span class="font-bold">{{ donations ? donations.length : 0 }}</span>
          Donasi
          <span class="float-right">
            <strong v-if="campaign.max_date">{{
              countDay(campaign.max_date)
            }}</strong>
            <strong v-else>0</strong> hari lagi</span
          >
        </div>

        <div v-if="campaign.max_date && maxDate(campaign.max_date) == true">
          <div class="mt-5">
            <button
              class="bg-yellow-500 py-3 rounded-md shadow-md text-xl w-full uppercase font-bold focus:outline-none opacity-50 cursor-not-allowed"
            >
              Donasi Ditutup!
            </button>
          </div>
        </div>
        <div v-else-if="campaign.max_date">
          <div class="mt-5">
            <router-link
              :to="{
                name: 'donation.create',
                params: { slug: route.params.slug },
              }"
            >
              <button
                class="bg-yellow-500 py-3 rounded-md shadow-md text-xl w-full uppercase font-bold focus:outline-none focus:bg-yellow-600"
              >
                Donasi Sekarang!
              </button>
            </router-link>
          </div>
        </div>
      </div>
      <div v-else class="bg-white rounded-md shadow-md p-3">
        <FacebookLoader class="h-64" />
      </div>
    </div>

    <div
      v-if="user && Object.keys(user).length > 0"
      class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12"
    >
      <div class="bg-white rounded-md shadow-md p-3">
        <div class="text-lg font-semibold">Penggalang Dana</div>
        <div class="border-2 border-gray-200 mt-3 mb-2"></div>

        <div class="bg-gray-200 p-3 rounded shadow-md mb-3">
          <div class="grid grid-cols-10 gap-4">
            <div class="col-span-2 flex-shrink-0">
              <img
                :src="donaturAvatarComputed"
                class="w-16 h-16 min-w-16 min-h-16 rounded-full shadow object-cover"
                :alt="user.name + ' Avatar'"
              />
            </div>
            <div class="col-span-8 text-lg font-bold mt-6">
              {{ user.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="campaign && Object.keys(campaign).length > 0"
      class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12"
    >
      <div class="bg-white rounded-md shadow-md p-3">
        <div class="text-lg font-semibold">Cerita</div>
        <div class="border-2 border-gray-200 mt-3 mb-2"></div>
        <div v-html="campaign.description"></div>
      </div>
    </div>

    <div
      v-if="donations"
      class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12"
    >
      <div class="bg-white rounded-md shadow-md p-3">
        <div class="text-lg font-semibold">Donasi ({{ donations.length }})</div>
        <div class="border-2 border-gray-200 mt-3 mb-2"></div>

        <div v-if="donations.length > 0">
          <div
            v-for="donation in donations"
            :key="donation.id"
            class="bg-gray-200 p-3 rounded shadow-md mb-3"
          >
            <div class="grid grid-cols-10 gap-4">
              <div class="col-span-1 flex-shrink-0">
                <img
                  :src="getDonationDonaturAvatar(donation.donatur)"
                  class="w-16 h-16 min-w-16 min-h-16 rounded-full object-cover"
                  :alt="donation.donatur.name + ' Avatar'"
                />
              </div>
              <div class="col-span-9 mt-1">
                <div class="text-base font-bold">
                  {{ donation.donatur.name }}
                </div>
                <div class="text-sm mt-2 text-gray-500">
                  Berdonasi sebesar
                  <span class="font-bold"
                    >Rp. {{ formatPrice(donation.amount) }}</span
                  >
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 mt-3">
              <div class="text-gray-600 text-sm">
                {{ donation.pray }}
              </div>
              <div class="text-gray-500 text-sm italic text-right">
                {{ donation.created_at }}
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="donations && donations.length === 0">
          <p class="text-gray-600 text-center">
            Belum ada donasi untuk campaign ini.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//hook vue
import { computed, onMounted } from "vue";
//hook vuex
import { useStore } from "vuex";
//hook vue router
import { useRoute } from "vue-router"; // <--- Pastikan useRoute diimpor
// Loader
import { FacebookLoader } from "vue-content-loader";
import globalMixins from "@/mixins"; // Import mixin di sini

export default {
  name: "CampaignShowComponent",
  components: {
    FacebookLoader,
  },
  setup() {
    const route = useRoute(); // <--- Inisialisasi useRoute
    const store = useStore();

    onMounted(() => {
      store.dispatch("campaign/getDetailCampaign", route.params.slug);
    });

    const campaignImageComputed = computed(() => {
      const fetchedCampaign = store.state.campaign.campaign;
      if (!fetchedCampaign || !fetchedCampaign.id) {
        return "";
      }
      const LARAVEL_BASE_URL = "http://donasi-dm.test";

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
          imageUrl = `${LARAVEL_BASE_URL}/storage/campaigns/${fetchedCampaign.image}`;
        }
      } else {
        imageUrl = "https://placehold.co/384x512/E0E0E0/333333?text=No+Image";
      }
      return imageUrl;
    });

    const campaign = computed(() => {
      const fetchedCampaign = store.state.campaign.campaign;
      if (!fetchedCampaign || !fetchedCampaign.id) {
        return {};
      }
      return fetchedCampaign;
    });

    const user = computed(() => {
      const fetchedUser = store.state.campaign.user;
      if (!fetchedUser || !fetchedUser.id) {
        return {};
      }
      return fetchedUser;
    });

    const donaturAvatarComputed = computed(() => {
      if (user.value && user.value.name) {
        if (user.value.profile_photo_url) {
          return user.value.profile_photo_url;
        } else if (user.value.avatar) {
          const LARAVEL_STORAGE_BASE_URL =
            "http://donasi-dm.test/storage/donaturs/";
          if (
            user.value.avatar.startsWith("http://") ||
            user.value.avatar.startsWith("https://")
          ) {
            return user.value.avatar;
          } else {
            return `${LARAVEL_STORAGE_BASE_URL}${user.value.avatar}`;
          }
        } else {
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.value.name || "User"
          )}&background=random&color=fff&size=128`;
        }
      }
      return "";
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
            donatur.name || "Donatur"
          )}&background=random&color=fff&size=128`;
        }
      }
      return "";
    };

    const sumDonation = computed(() => {
      return store.state.campaign.sumDonation || [];
    });

    const donations = computed(() => {
      return store.state.campaign.donations || [];
    });

    // Ekstraksi method dari mixin agar tersedia di template
    const { formatPrice, percentage, maxDate, countDay } = globalMixins.methods;

    return {
      campaign,
      campaignImageComputed,
      user,
      donaturAvatarComputed,
      getDonationDonaturAvatar,
      sumDonation,
      donations,
      formatPrice,
      percentage,
      maxDate,
      countDay,
      route, // <--- Penting: Kembalikan `route` agar bisa diakses di template
    };
  },
};
</script>

<style></style>
