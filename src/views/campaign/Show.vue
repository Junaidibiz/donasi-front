<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div v-if="campaign.id">
        <!-- Check if campaign data is loaded -->
        <div class="bg-white rounded-md shadow-md p-3 mb-5">
          <!-- Campaign Image -->
          <img
            class="rounded-md w-full h-56 object-cover"
            :src="campaign.imageComputed"
            width="384"
            height="512"
          />

          <div class="p-3">
            <h3 class="text-xl font-semibold">{{ campaign.title }}</h3>
            <!-- Display campaign title -->
            <p class="text-xs text-gray-500 mt-2">{{ campaign.user.name }}</p>
            <!-- Display user name -->

            <div v-if="sumDonation.length > 0">
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
              </div>
            </div>
            <div v-else>
              <p class="mt-4 text-base text-gray-500">
                <span class="font-bold text-blue-400">Rp. 0 </span> terkumpul
                dari
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
                      width: percentage(0, campaign.target_donation) + '%',
                    }"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  ></div>
                </div>
              </div>
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

      <!-- Fundraiser (Penggalang Dana) Section -->
      <div v-if="user.id" class="bg-white rounded-md shadow-md p-3 mt-3 mb-5">
        <div class="text-lg font-semibold">Penggalang Dana</div>
        <div class="border-2 border-gray-200 mt-3 mb-2"></div>
        <div class="bg-gray-200 p-3 rounded shadow-md mb-3">
          <div class="grid grid-cols-10 gap-4 items-center">
            <div class="col-span-2 w-16 h-16 flex-shrink-0">
              <img
                :src="user.avatarComputed"
                class="w-full h-full rounded-full shadow object-cover"
              />
            </div>
            <div class="col-span-8 text-lg font-bold">
              {{ user.name }}
            </div>
          </div>
        </div>
      </div>

      <!-- Story (Cerita) Section -->
      <div
        v-if="campaign.description"
        class="bg-white rounded-md shadow-md p-3 mt-3 mb-5"
      >
        <div class="text-lg font-semibold">Cerita</div>
        <div class="border-2 border-gray-200 mt-3 mb-2"></div>
        <div class="text-sm text-gray-600" v-html="campaign.description"></div>
      </div>

      <!-- Donations List Section -->
      <div
        v-if="donations && donations.length > 0"
        class="bg-white rounded-md shadow-md p-3 mt-3 mb-5"
      >
        <div class="text-lg font-semibold">Donasi ({{ donations.length }})</div>
        <div class="border-2 border-gray-200 mt-3 mb-2"></div>
        <div
          v-for="donation in donations"
          :key="donation.id"
          class="bg-gray-200 p-3 rounded shadow-md mb-3"
        >
          <div class="grid grid-cols-10 gap-4">
            <div class="col-span-1 w-16 h-16 flex-shrink-0">
              <img
                :src="donation.donatur.avatarComputed"
                class="w-full h-full rounded-full object-cover"
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
    </div>
  </div>
</template>

<script>
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

    const campaign = computed(() => {
      const fetchedCampaign = store.state.campaign.campaign;
      if (!fetchedCampaign || !fetchedCampaign.id) {
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
          imageUrl = `${LARAVEL_BASE_URL}/storage/campaigns/${fetchedCampaign.image}`; // Adjust folder if different
        }
      } else {
        imageUrl = "https://placehold.co/384x512/E0E0E0/333333?text=No+Image"; // Placeholder image
      }

      return {
        ...fetchedCampaign,
        imageComputed: imageUrl,
      };
    });

    const user = computed(() => {
      const fetchedUser = store.state.campaign.user;
      if (!fetchedUser || !fetchedUser.id) {
        return {};
      }
      // KOREKSI UTAMA: Gunakan profile_photo_url jika ada, jika tidak, fallback ke ui-avatars.com
      let avatarUrl;
      if (fetchedUser.profile_photo_url) {
        // <-- PERIKSA profile_photo_url
        avatarUrl = fetchedUser.profile_photo_url; // Ini sudah URL lengkap dari backend
      } else {
        // Fallback ke UI-Avatars jika profile_photo_url adalah null/undefined/empty
        avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          fetchedUser.name || "User"
        )}&background=random&color=fff&size=128`;
      }
      return {
        ...fetchedUser,
        avatarComputed: avatarUrl,
      };
    });

    const sumDonation = computed(() => {
      return store.state.campaign.sumDonation;
    });

    const donations = computed(() => {
      const fetchedDonations = Array.isArray(store.state.campaign.donations)
        ? store.state.campaign.donations
        : [];

      return fetchedDonations.map((donation) => {
        if (!donation.donatur) {
          return {
            ...donation,
            donatur: {
              avatarComputed: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                "Anonim"
              )}&background=random&color=fff&size=128`,
            },
          };
        }

        // KOREKSI: Gunakan profile_photo_url untuk donatur, jika tidak, fallback ke ui-avatars.com
        let donaturAvatarUrl;
        if (donation.donatur.profile_photo_url) {
          // <-- PERIKSA profile_photo_url donatur
          donaturAvatarUrl = donation.donatur.profile_photo_url; // Ini sudah URL lengkap
        } else {
          // Fallback ke UI-Avatars jika profile_photo_url donatur adalah null/undefined/empty
          donaturAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            donation.donatur.name || "Donatur"
          )}&background=random&color=fff&size=128`;
        }
        return {
          ...donation,
          donatur: {
            ...donation.donatur,
            avatarComputed: donaturAvatarUrl,
          },
        };
      });
    });

    return {
      campaign,
      user,
      sumDonation,
      donations,
    };
  },
};
</script>

<style>
/* Anda dapat menambahkan gaya khusus di sini jika diperlukan, atau biarkan kosong jika sepenuhnya menggunakan Tailwind */
</style>
