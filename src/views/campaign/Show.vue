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
            campaign.user?.name
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
          class="block w-full text-center bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-xl"
        >
          Donasi Sekarang!
        </router-link>
      </div>

      <div class="mt-8 mb-6">
        <div class="flex items-center justify-start gap-4">
          <div
            class="flex flex-col items-center text-center text-gray-600 pr-2"
          >
            <svg
              enable-background="new 0 0 24 24"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <g>
                  <g>
                    <rect
                      height="8.016"
                      transform="matrix(0.5335 0.8458 -0.8458 0.5335 11.975 -6.3075)"
                      width="0.799"
                      x="11.306"
                      y="3.694"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <g>
                      <path
                        d="M4.673,16.697c-2.59,0-4.697-2.107-4.697-4.697s2.107-4.697,4.697-4.697c2.59,0,4.698,2.107,4.698,4.697 S7.264,16.697,4.673,16.697z M4.673,8.102c-2.149,0-3.897,1.749-3.897,3.898c0,2.15,1.748,3.896,3.897,3.896 c2.15,0,3.898-1.746,3.898-3.896C8.571,9.851,6.823,8.102,4.673,8.102z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M19.326,9.418c-2.59,0-4.697-2.107-4.697-4.698c0-2.59,2.107-4.697,4.697-4.697s4.697,2.107,4.697,4.697 C24.023,7.311,21.916,9.418,19.326,9.418z M19.326,0.823c-2.148,0-3.898,1.749-3.898,3.897c0,2.149,1.75,3.898,3.898,3.898 c2.15,0,3.898-1.749,3.898-3.898C23.225,2.571,21.477,0.823,19.326,0.823z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <path
                        d="M19.326,23.977c-2.59,0-4.697-2.107-4.697-4.697s2.107-4.697,4.697-4.697s4.697,2.107,4.697,4.697 S21.916,23.977,19.326,23.977z M19.326,15.381c-2.148,0-3.898,1.75-3.898,3.898s1.75,3.898,3.898,3.898 c2.15,0,3.898-1.75,3.898-3.898S21.477,15.381,19.326,15.381z"
                      />
                    </g>
                  </g>
                  <g>
                    <g>
                      <rect
                        height="0.801"
                        transform="matrix(0.8806 0.4739 -0.4739 0.8806 9.1913 -3.4443)"
                        width="7.946"
                        x="7.457"
                        y="16.114"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </svg>
            <span class="text-xs mt-1 font-semibold">Share</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="shareToFacebook"
              title="Facebook"
              class="share-button-horizontal"
            >
              <svg
                viewBox="0 0 512 512"
                style="
                  fill: currentColor;
                  stroke-linejoin: round;
                  stroke-miterlimit: 2;
                "
              >
                <path
                  d="M512,257.555c0,-141.385 -114.615,-256 -256,-256c-141.385,0 -256,114.615 -256,256c0,127.777 93.616,233.685 216,252.89l0,-178.89l-65,0l0,-74l65,0l0,-56.4c0,-64.16 38.219,-99.6 96.695,-99.6c28.009,0 57.305,5 57.305,5l0,63l-32.281,0c-31.801,0 -41.719,19.733 -41.719,39.978l0,48.022l71,0l-11.35,74l-59.65,0l0,178.89c122.385,-19.205 216,-125.113 216,-252.89Z"
                  style="fill-rule: nonzero"
                />
              </svg>
            </button>
            <button
              @click="shareToTwitter"
              title="X"
              class="share-button-horizontal"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                />
              </svg>
            </button>
            <button
              @click="shareToWhatsApp"
              title="WhatsApp"
              class="share-button-horizontal"
            >
              <svg
                style="
                  fill-rule: evenodd;
                  clip-rule: evenodd;
                  stroke-linejoin: round;
                  stroke-miterlimit: 2;
                "
                viewBox="0 0 512 512"
                fill="currentColor"
              >
                <path
                  d="M373.295,307.064c-6.37,-3.188 -37.687,-18.596 -43.526,-20.724c-5.838,-2.126 -10.084,-3.187 -14.331,3.188c-4.246,6.376 -16.454,20.725 -20.17,24.976c-3.715,4.251 -7.431,4.785 -13.8,1.594c-6.37,-3.187 -26.895,-9.913 -51.225,-31.616c-18.935,-16.89 -31.72,-37.749 -35.435,-44.126c-3.716,-6.377 -0.397,-9.824 2.792,-13c2.867,-2.854 6.371,-7.44 9.555,-11.16c3.186,-3.718 4.247,-6.377 6.37,-10.626c2.123,-4.252 1.062,-7.971 -0.532,-11.159c-1.591,-3.188 -14.33,-34.542 -19.638,-47.298c-5.171,-12.419 -10.422,-10.737 -14.332,-10.934c-3.711,-0.184 -7.963,-0.223 -12.208,-0.223c-4.246,0 -11.148,1.594 -16.987,7.969c-5.838,6.377 -22.293,21.789 -22.293,53.14c0,31.355 22.824,61.642 26.009,65.894c3.185,4.252 44.916,68.59 108.816,96.181c15.196,6.564 27.062,10.483 36.312,13.418c15.259,4.849 29.145,4.165 40.121,2.524c12.238,-1.827 37.686,-15.408 42.995,-30.286c5.307,-14.882 5.307,-27.635 3.715,-30.292c-1.592,-2.657 -5.838,-4.251 -12.208,-7.44m-116.224,158.693l-0.086,0c-38.022,-0.015 -75.313,-10.23 -107.845,-29.535l-7.738,-4.592l-80.194,21.037l21.405,-78.19l-5.037,-8.017c-21.211,-33.735 -32.414,-72.726 -32.397,-112.763c0.047,-116.825 95.1,-211.87 211.976,-211.87c56.595,0.019 109.795,22.088 149.801,62.139c40.005,40.05 62.023,93.286 62.001,149.902c-0.048,116.834 -95.1,211.889 -211.886,211.889m180.332,-392.224c-48.131,-48.186 -112.138,-74.735 -180.335,-74.763c-140.514,0 -254.875,114.354 -254.932,254.911c-0.018,44.932 11.72,88.786 34.03,127.448l-36.166,132.102l135.141,-35.45c37.236,20.31 79.159,31.015 121.826,31.029l0.105,0c140.499,0 254.87,-114.366 254.928,-254.925c0.026,-68.117 -26.467,-132.166 -74.597,-180.352"
                />
              </svg>
            </button>
            <button
              @click="shareToTelegram"
              title="Telegram"
              class="share-button-horizontal"
            >
              <svg viewBox="0 0 32 32" fill="currentColor">
                <g>
                  <path
                    d="M24.687,30.163c-0.402,0-0.843-0.132-1.32-0.395l-10.803-7.976c-0.121-0.089-0.195-0.228-0.203-0.378 c-0.007-0.15,0.053-0.295,0.165-0.396L25.322,9.503c0.205-0.185,0.521-0.169,0.706,0.037c0.185,0.205,0.168,0.521-0.037,0.706 l-12.34,11.106l10.254,7.576c0.271,0.145,0.729,0.329,1.055,0.178c0.332-0.152,0.496-0.637,0.576-1.017l4.375-20.617 c0.17-0.681,0.088-1.229-0.215-1.481c-0.231-0.192-0.575-0.206-0.947-0.038L3.033,15.871C2.244,16.188,1.996,16.514,2,16.622 c0.003,0.071,0.173,0.267,0.68,0.422l6.375,1.99l6.999-4.416c0.234-0.146,0.542-0.077,0.689,0.156 c0.147,0.233,0.078,0.542-0.156,0.689l-7.194,4.539C9.269,20.08,9.116,20.1,8.977,20.057l-6.592-2.058 c-1.17-0.358-1.37-0.99-1.384-1.335c-0.02-0.473,0.253-1.157,1.667-1.723l25.695-9.908c0.697-0.318,1.445-0.25,1.974,0.191 c0.613,0.511,0.813,1.413,0.549,2.474l-4.371,20.598c-0.184,0.878-0.566,1.457-1.137,1.719 C25.163,30.114,24.933,30.163,24.687,30.163z"
                  />
                  <path
                    d="M24.687,30.163c-0.402,0-0.843-0.132-1.32-0.395l-6.72-4.959c-0.222-0.164-0.27-0.478-0.105-0.699 c0.164-0.222,0.478-0.27,0.699-0.105l6.664,4.923c0.271,0.145,0.729,0.329,1.055,0.178c0.332-0.152,0.496-0.637,0.576-1.017 l4.375-20.617c0.17-0.681,0.088-1.229-0.215-1.481c-0.231-0.192-0.575-0.206-0.947-0.038L3.033,15.871 C2.244,16.188,1.996,16.514,2,16.622c0.003,0.071,0.173,0.267,0.68,0.422l6.594,2.058c0.158,0.049,0.281,0.174,0.33,0.332 l2.267,7.461c0.061,0.167,0.108,0.333,0.149,0.477c0.032,0.114,0.072,0.256,0.099,0.298c-0.004-0.005,0.076,0.019,0.289,0.02 c0.447,0,0.617-0.167,0.957-0.498l1.66-1.614c0.198-0.194,0.514-0.188,0.707,0.01c0.192,0.198,0.188,0.515-0.01,0.707L14.09,27.88 c-0.402,0.393-0.828,0.809-1.682,0.809c-0.98,0-1.178-0.434-1.351-1.046c-0.035-0.124-0.075-0.267-0.135-0.432l-2.198-7.233 l-6.339-1.979c-1.17-0.358-1.37-0.99-1.384-1.335c-0.02-0.473,0.253-1.157,1.667-1.723l25.695-9.908 c0.697-0.318,1.445-0.25,1.974,0.191c0.613,0.511,0.813,1.413,0.549,2.474l-4.371,20.598c-0.184,0.878-0.566,1.457-1.137,1.719 C25.163,30.114,24.933,30.163,24.687,30.163z"
                  />
                  <g>
                    <g>
                      <g>
                        <g>
                          <g>
                            <g>
                              <path
                                d="M18.5,14c0,0.275-0.225,0.5-0.5,0.5l0,0c-0.275,0-0.5-0.225-0.5-0.5l0,0c0-0.275,0.225-0.5,0.5-0.5 l0,0C18.275,13.5,18.5,13.725,18.5,14L18.5,14z"
                              />
                            </g>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
            <button
              @click="copyLink"
              title="Instagram"
              class="share-button-horizontal"
            >
              <svg
                data-name="Layer 1"
                id="Layer_1"
                viewBox="0 0 128 128"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <path
                  d="M83,23a22,22,0,0,1,22,22V83a22,22,0,0,1-22,22H45A22,22,0,0,1,23,83V45A22,22,0,0,1,45,23H83m0-8H45A30.09,30.09,0,0,0,15,45V83a30.09,30.09,0,0,0,30,30H83a30.09,30.09,0,0,0,30-30V45A30.09,30.09,0,0,0,83,15Z"
                />
                <path
                  d="M90.14,32a5.73,5.73,0,1,0,5.73,5.73A5.73,5.73,0,0,0,90.14,32Z"
                />
                <path
                  d="M64.27,46.47A17.68,17.68,0,1,1,46.6,64.14,17.7,17.7,0,0,1,64.27,46.47m0-8A25.68,25.68,0,1,0,90,64.14,25.68,25.68,0,0,0,64.27,38.47Z"
                />
              </svg>
            </button>
            <button
              @click="copyLink"
              title="Email"
              class="share-button-horizontal"
            >
              <svg
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <g
                  data-name="mail email e-mail letter"
                  id="mail_email_e-mail_letter"
                >
                  <path
                    d="M28,13a1,1,0,0,0-1,1v8a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V14a1,1,0,0,0-2,0v8a3,3,0,0,0,.88,2.12A3,3,0,0,0,6,25H26a3,3,0,0,0,2.12-.88A3,3,0,0,0,29,22V14A1,1,0,0,0,28,13Z"
                  />
                  <path
                    d="M15.4,18.8a1,1,0,0,0,1.2,0L28.41,9.94a1,1,0,0,0,.3-1.23,3.06,3.06,0,0,0-.59-.83A3,3,0,0,0,26,7H6a3,3,0,0,0-2.12.88,3.06,3.06,0,0,0-.59.83,1,1,0,0,0,.3,1.23ZM6,9H26a.9.9,0,0,1,.28,0L16,16.75,5.72,9A.9.9,0,0,1,6,9Z"
                  />
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-base font-semibold mb-2">Cerita</h2>
        <div
          class="text-sm text-gray-700 leading-relaxed mb-6 prose max-w-none break-words"
          v-html="processedDescription"
        ></div>
      </div>

      <div class="pt-6">
        <div class="flex mb-4">
          <button
            @click="activeTab = 'donasi'"
            :class="[
              'flex-grow py-2 text-center font-semibold focus:outline-none transition-colors duration-300',
              activeTab === 'donasi'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500',
            ]"
          >
            Donasi ({{ donations.length }})
          </button>
          <button
            @click="activeTab = 'laporan'"
            :class="[
              'flex-grow py-2 text-center font-semibold focus:outline-none transition-colors duration-300',
              activeTab === 'laporan'
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500',
            ]"
          >
            Laporan Pengeluaran
          </button>
        </div>

        <div v-if="activeTab === 'donasi'">
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
              <div class="w-full">
                <span class="font-semibold text-sm">{{
                  donation.donatur.name
                }}</span>
                <div class="text-green-600 text-sm font-medium mt-1">
                  Berdonasi sebesar: Rp {{ formatPrice(donation.amount) }}
                </div>
                <p
                  v-if="donation.pray"
                  class="text-sm text-gray-600 mt-1 italic"
                >
                  "{{ donation.pray }}"
                </p>
                <div class="text-right text-xs text-gray-500 mt-2">
                  {{ formatDate(donation.created_at) }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-sm text-gray-500 py-4">
            Jadilah orang pertama yang berdonasi di campaign ini!
          </div>
        </div>

        <div v-if="activeTab === 'laporan'">
          <div
            v-if="processedExpenseReports && processedExpenseReports.length > 0"
            class="space-y-4"
          >
            <div
              v-for="report in processedExpenseReports"
              :key="report.id"
              class="bg-gray-100 rounded-xl p-4"
            >
              <p class="font-bold text-base mb-1">
                {{ report.title }}
              </p>
              <div
                class="flex justify-between items-center text-xs text-gray-600 mb-2"
              >
                <p class="font-semibold">
                  {{ formatDate(report.expense_date) }}
                </p>
                <p class="font-bold">
                  Dana Pengeluaran:
                  <span class="text-red-600"
                    >- Rp {{ formatPrice(report.amount) }}</span
                  >
                </p>
              </div>
              <hr class="my-2 border-gray-300" />
              <div
                class="text-sm text-gray-700 leading-relaxed prose max-w-none break-words"
                v-html="report.description"
              ></div>
            </div>
          </div>
          <div v-else class="text-center text-sm text-gray-500 py-4">
            Belum ada laporan penggunaan dana untuk campaign ini.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { FacebookLoader } from "vue-content-loader";
import { useSocialShare } from "@/composables/useSocialShare";

export default {
  name: "CampaignShowComponent",
  components: {
    FacebookLoader,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const activeTab = ref("donasi");
    const LARAVEL_BASE_URL = "http://donasi-dm.test";

    onMounted(() => {
      store.dispatch("campaign/getDetailCampaign", route.params.slug);
    });

    const campaign = computed(() => store.state.campaign.campaign);

    const donations = computed(() => {
      const allDonations = store.state.campaign.donations || [];
      return allDonations.filter((d) => d && d.donatur && d.donatur.name);
    });

    const expenseReports = computed(
      () => store.state.campaign.expenseReports || []
    );

    const processedExpenseReports = computed(() => {
      return expenseReports.value.map((report) => {
        const processedDescription = report.description.replace(
          /src="\/storage\//g,
          `src="${LARAVEL_BASE_URL}/storage/`
        );
        return {
          ...report,
          description: processedDescription,
        };
      });
    });

    const {
      shareToFacebook,
      shareToTwitter,
      shareToWhatsApp,
      shareToTelegram,
      copyLink,
    } = useSocialShare(campaign);

    const processedDescription = computed(() => {
      if (!campaign.value.description) return "";
      const descriptionHtml = campaign.value.description;
      return descriptionHtml.replace(
        /<img[^>]+src="([^"]+)"/g,
        (match, src) => {
          if (src.startsWith("http")) {
            return match;
          }
          return match.replace(src, `${LARAVEL_BASE_URL}${src}`);
        }
      );
    });

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

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    const percentage = (total, target) => {
      if (!target || target == 0) return 0;
      return (total / target) * 100;
    };

    const countDay = (max_date) => {
      if (!max_date) return 0;
      let d1 = new Date(max_date);
      let d2 = new Date();
      if (d1 < d2) return 0;
      return parseInt((d1 - d2) / (1000 * 60 * 60 * 24));
    };

    return {
      campaign,
      donations,
      processedExpenseReports,
      activeTab,
      processedDescription,
      formatPrice,
      formatDate,
      percentage,
      countDay,
      getDonaturAvatar,
      shareToFacebook,
      shareToTwitter,
      shareToWhatsApp,
      shareToTelegram,
      copyLink,
    };
  },
};
</script>

<style scoped>
.share-button-horizontal {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px; /* Lebar tombol */
  height: 40px; /* Tinggi tombol */
  border-radius: 8px; /* Sudut tombol */
  background-color: #f3f4f6; /* Warna latar belakang abu-abu terang */
  color: #4b5563; /* Warna ikon abu-abu gelap */
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  border: none;
  padding: 8px;
}

.share-button-horizontal svg {
  width: 100%;
  height: 100%;
}

.share-button-horizontal:hover {
  background-color: #76a319; /* Warna latar belakang hover (hijau damu) */
  color: white; /* Warna ikon hover (putih) */
}
</style>
