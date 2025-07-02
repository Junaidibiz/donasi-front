<template>
  <div class="pb-20 pt-24">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div class="bg-white rounded-md shadow-md p-5">
        <div class="text-xl">RIWAYAT DONASI SAYA</div>
        <div class="border-2 border-gray-200 mt-3 mb-2"></div>

        <div v-if="donations && donations.length > 0">
          <div class="mt-5 space-y-4">
            <div v-for="donation in donations" :key="donation.id">
              <div v-if="donation.campaign && donation.campaign.slug">
                <div
                  class="bg-gray-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center w-full space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  <img
                    class="w-full sm:w-32 h-40 sm:h-28 object-cover rounded-lg flex-shrink-0"
                    :src="donation.campaignImageComputed"
                    :alt="sanitizeAttribute(donation.campaign.title)"
                    onerror="this.onerror=null;this.src='https://placehold.co/120x120/e2e8f0/e2e8f0';"
                  />
                  <div class="flex-1 w-full">
                    <div class="flex justify-between items-start">
                      <router-link
                        :to="{
                          name: 'campaign.show',
                          params: { slug: donation.campaign.slug },
                        }"
                      >
                        <h2
                          class="text-gray-800 font-semibold text-base leading-tight pr-2"
                        >
                          {{ donation.campaign.title }}
                        </h2>
                      </router-link>
                      <span
                        v-if="donation.status == 'success'"
                        class="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                        >Berhasil</span
                      >
                      <span
                        v-else-if="donation.status == 'pending'"
                        class="bg-yellow-400 text-gray-800 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                        >Pending</span
                      >
                      <span
                        v-else
                        class="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium flex-shrink-0"
                        >Dibatalkan</span
                      >
                    </div>

                    <div class="mt-2 flex justify-between items-center">
                      <span class="text-sm text-gray-600">{{
                        formatDate(donation.created_at)
                      }}</span>
                      <span class="text-sm text-blue-600 font-semibold"
                        >Rp. {{ formatPrice(donation.amount) }}</span
                      >
                    </div>

                    <button
                      v-if="donation.status == 'pending'"
                      @click.prevent="payment(donation.snap_token)"
                      class="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 rounded-lg"
                    >
                      BAYAR SEKARANG
                    </button>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="bg-gray-200 rounded-xl p-4 text-center text-gray-500"
              >
                Data Campaign untuk donasi ini tidak tersedia.
              </div>
            </div>
          </div>

          <div class="text-center mt-7" v-show="nextExists">
            <a
              @click="loadMore"
              class="bg-gray-700 text-white p-1 px-3 rounded-md shadow-md focus:outline-none focus:bg-gray-900 cursor-pointer"
            >
              LIHAT SEMUA <i class="fa fa-long-arrow-alt-right"></i>
            </a>
          </div>
        </div>
        <div v-else>
          <div class="mb-3 bg-red-500 text-white p-4 rounded-md">
            Anda Belum Memiliki Transaksi Donasi Saat ini!
          </div>
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
import { useRouter } from "vue-router"; // <-- Import useRouter
// Import mixin
import globalMixins from "@/mixins"; // Pastikan path ini benar

export default {
  name: "DonationComponent",
  setup() {
    //store vuex
    const store = useStore();
    //router
    const router = useRouter(); // <-- Inisialisasi useRouter

    //onMounted akan menjalankan action "getDonation" di module "donation"
    onMounted(() => {
      store.dispatch("donation/getDonation"); // <-- Memanggil action getDonation
    });

    // Fungsi utilitas untuk membersihkan string agar aman digunakan sebagai nilai atribut HTML
    const sanitizeAttribute = (str) => {
      if (typeof str !== "string") {
        return "";
      }
      return str
        .replace(/<!--.*?-->/g, "")
        .replace(/[<>&"']/g, "")
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
    };

    // Fungsi utilitas untuk memformat tanggal
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const options = { day: "2-digit", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-GB", options).replace(/ /g, "-");
    };

    //digunakan untuk get data state "donations" di module "donation"
    const donations = computed(() => {
      const fetchedDonations = Array.isArray(store.state.donation.donations)
        ? store.state.donation.donations
        : [];

      return fetchedDonations.map((donation) => {
        const LARAVEL_BASE_URL = "http://donasi-dm.test";

        let campaignImageUrl;
        if (donation.campaign.image) {
          if (
            donation.campaign.image.startsWith("http://") ||
            donation.campaign.image.startsWith("https://")
          ) {
            campaignImageUrl = donation.campaign.image;
          } else if (donation.campaign.image.startsWith("/storage")) {
            campaignImageUrl = `${LARAVEL_BASE_URL}${donation.campaign.image}`;
          } else {
            campaignImageUrl = `${LARAVEL_BASE_URL}/storage/campaigns/${donation.campaign.image}`;
          }
        } else {
          campaignImageUrl =
            "https://placehold.co/384x512/E0E0E0/333333?text=No+Image";
        }

        return {
          ...donation,
          campaignImageComputed: campaignImageUrl,
        };
      });
    });

    //digunakan untuk get data state "nextExists" di module "donation"
    const nextExists = computed(() => {
      return store.state.donation.nextExists;
    });

    //digunakan untuk get data state "nextPage" di module "donation"
    const nextPage = computed(() => {
      return store.state.donation.nextPage;
    });

    //loadMore function
    function loadMore() {
      store.dispatch("donation/getLoadMore", nextPage.value);
    }

    //function payment "Midtrans"
    function payment(snap_token) {
      if (window.snap) {
        // Pastikan window.snap sudah tersedia
        window.snap.pay(snap_token, {
          onSuccess: function () {
            router.push({ name: "donation.index" });
          },
          onPending: function () {
            router.push({ name: "donation.index" });
          },
          onError: function (result) {
            console.error("Payment error:", result);
            router.push({ name: "donation.index" });
          },
          onClose: function () {
            // Opsional: Handle jika popup ditutup tanpa menyelesaikan transaksi
            console.log(
              "Payment popup closed without finishing the transaction"
            );
            // router.push({name: 'donation.index'}); // Bisa diarahkan ulang atau biarkan di halaman saat ini
          },
        });
      } else {
        console.error("Midtrans Snap is not loaded.");
        // Beri tahu pengguna bahwa pembayaran tidak dapat diproses (misalnya dengan toast)
        // toast.error("Pembayaran tidak dapat diproses. Coba lagi nanti.");
      }
    }

    // Ekstraksi method dari mixin agar tersedia di template
    const { formatPrice } = globalMixins.methods;

    return {
      donations,
      nextExists,
      nextPage,
      loadMore,
      formatPrice,
      sanitizeAttribute,
      formatDate,
      payment, // <-- Kembalikan fungsi payment
    };
  },
};
</script>

<style></style>
