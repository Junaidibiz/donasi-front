<template>
  <div class="bg-white sm:bg-transparent pb-20 pt-24">
    <div
      v-if="!campaign || Object.keys(campaign).length === 0"
      class="max-w-2xl mx-auto bg-white sm:shadow-lg sm:rounded-2xl overflow-hidden p-4 sm:p-6"
    >
      <FacebookLoader class="h-96" />
    </div>

    <div
      v-else
      class="max-w-2xl mx-auto bg-white sm:shadow-lg sm:rounded-2xl overflow-hidden p-4 sm:p-6"
    >
      <div
        class="h-56 bg-gray-200 flex items-center justify-center rounded-xl overflow-hidden"
      >
        <img
          :src="campaign.image"
          :alt="campaign.title"
          class="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div class="pt-5">
        <div v-if="campaign.user" class="flex items-center gap-2 text-sm mb-2">
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
          <span class="font-medium text-gray-600">{{
            campaign.user.name
          }}</span>
        </div>

        <h1 class="text-xl font-bold mb-3">{{ campaign.title }}</h1>

        <div>
          <div class="text-green-600 text-xl font-bold">
            Rp {{ formatPrice(campaign.total_donation) }}
          </div>
          <div class="text-sm text-gray-500 mb-2">
            Terkumpul dari Rp {{ formatPrice(campaign.target_donation) }}
          </div>
          <div class="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              class="bg-green-500 h-2"
              :style="{
                width:
                  percentage(
                    campaign.total_donation,
                    campaign.target_donation
                  ) + '%',
              }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1 mb-5">
            <span class="text-green-600"
              >{{
                Math.floor(
                  percentage(campaign.total_donation, campaign.target_donation)
                )
              }}% Target Tercapai</span
            >
            <span>{{ countDay(campaign.max_date) }} Hari Lagi</span>
          </div>
        </div>

        <div v-if="countDay(campaign.max_date) === 0">
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
          v-html="campaign.description"
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
              :src="getDonaturAvatar(donation.donatur)"
              class="w-10 h-10 rounded-full shrink-0 object-cover"
            />
            <div>
              <span class="font-semibold text-sm">{{
                donation.donatur ? donation.donatur.name : "Donatur Anonim"
              }}</span>
              <div class="text-green-600 text-sm font-medium mt-1">
                Berdonasi sebesar: Rp {{ formatPrice(donation.amount) }}
              </div>
              <p v-if="donation.pray" class="text-sm text-gray-600 mt-1 italic">
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
    const store = useStore();
    const route = useRoute();

    onMounted(() => {
      store.dispatch("campaign/getDetailCampaign", route.params.slug);
    });

    const campaign = computed(() => store.state.campaign.campaign);
    const donations = computed(() => store.state.campaign.donations);

    const getDonaturAvatar = (donatur) => {
      if (donatur && donatur.avatar) {
        return donatur.avatar;
      }
      const name = donatur ? donatur.name : "D";
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random&color=fff&size=128`;
    };

    const formatPrice = (value) => {
      if (!value) return "0";
      let val = (value / 1).toFixed(0).replace(".", ",");
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const percentage = (total, target) => {
      if (!target || target == 0) return 0;
      return (total / target) * 100;
    };

    const countDay = (max_date) => {
      if (!max_date) return 0;
      let d1 = new Date(max_date);
      let d2 = new Date();
      let t2 = d1.getTime();
      let t1 = d2.getTime();
      if (t2 < t1) {
        return 0;
      }
      return parseInt((t2 - t1) / (24 * 3600 * 1000));
    };

    return {
      campaign,
      donations,
      formatPrice,
      percentage,
      countDay,
      getDonaturAvatar,
    };
  },
};
</script>
