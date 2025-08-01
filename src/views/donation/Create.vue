<template>
  <div class="pb-20 pt-24 bg-white min-h-screen">
    <div class="container mx-auto max-w-md p-4">
      <div class="space-y-6">
        <div class="flex items-center space-x-3">
          <button
            @click="goBack"
            class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <i class="fa fa-arrow-left text-gray-700"></i>
          </button>
          <h1 class="text-lg font-semibold text-gray-800">Donasi</h1>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <button
            @click="isiNominal(10000)"
            class="border rounded-xl p-4 text-center shadow-sm hover:bg-green-50 transition"
          >
            <div class="text-2xl">😊</div>
            <div class="mt-2 font-semibold">Rp10.000</div>
          </button>
          <button
            @click="isiNominal(50000)"
            class="border rounded-xl p-4 text-center shadow-sm hover:bg-green-50 transition"
          >
            <div class="text-2xl">😂</div>
            <div class="mt-2 font-semibold">Rp50.000</div>
          </button>
          <button
            @click="isiNominal(100000)"
            class="border rounded-xl p-4 text-center shadow-sm hover:bg-green-50 transition"
          >
            <div class="text-2xl">😘</div>
            <div class="mt-2 font-semibold">Rp100.000</div>
          </button>
          <button
            @click="isiNominal(250000)"
            class="border rounded-xl p-4 text-center shadow-sm hover:bg-green-50 transition"
          >
            <div class="text-2xl">😍</div>
            <div class="mt-2 font-semibold">Rp250.000</div>
          </button>
        </div>

        <form @submit.prevent="storeDonation" class="space-y-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1"
              >Masukkan Nominal Donasi</label
            >
            <div
              class="flex items-center px-4 py-3 bg-gray-100 rounded-lg text-gray-500"
            >
              <span class="mr-2 font-semibold text-gray-800">Rp</span>
              <input
                v-model="donation.amount"
                type="number"
                placeholder="0"
                class="bg-transparent outline-none w-full text-right font-bold text-gray-800"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm text-gray-600 mb-1"
              >Tulis Do'a (Opsional)</label
            >
            <textarea
              v-model="donation.pray"
              rows="3"
              placeholder="Tulis Do'a / Ucapan Anda di sini..."
              class="bg-gray-100 rounded-lg text-gray-800 w-full p-3 outline-none"
            ></textarea>

            <div class="mt-2 flex flex-wrap gap-2">
              <button
                @click.prevent="addQuickPray('Semoga berkah dan bermanfaat.')"
                class="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-300 transition"
              >
                🤲 Semoga Berkah
              </button>
              <button
                @click.prevent="addQuickPray('Semoga menjadi amal jariyah.')"
                class="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-300 transition"
              >
                💖 Amal Jariyah
              </button>
              <button
                @click.prevent="addQuickPray('Untuk almarhum/almarhumah...')"
                class="bg-gray-200 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full hover:bg-gray-300 transition"
              >
                💭 Untuk Almarhum/ah
              </button>
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Lanjut Pembayaran
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  name: "DonationCreateComponent",
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const donation = reactive({
      amount: 0,
      pray: "",
      campaignSlug: route.params.slug,
    });

    function isiNominal(value) {
      donation.amount = value;
    }

    function goBack() {
      router.go(-1);
    }

    function addQuickPray(text) {
      if (donation.pray.includes(text)) return;
      if (donation.pray) {
        donation.pray += ` ${text}`;
      } else {
        donation.pray = text;
      }
    }

    function storeDonation() {
      if (donation.amount < 10000) {
        toast.error("Donasi Minimal Rp. 10.000");
        return false;
      }

      const dataToSend = {
        amount: donation.amount,
        pray: donation.pray,
        campaign_slug: donation.campaignSlug,
      };

      store
        .dispatch("donation/storeDonation", dataToSend)
        .then((response) => {
          toast.success("Transaksi Berhasil Dibuat!");

          const snapToken = response.data.data.snap_token;

          router.push({
            name: "donation.index",
            query: { snap_token: snapToken },
          });
        })
        .catch((error) => {
          console.error("Error storing donation:", error);
          if (error.amount) {
            toast.error(`${error.amount[0]}`);
          }
          if (error.pray) {
            toast.error(`${error.pray[0]}`);
          }
          if (error.message && !error.amount && !error.pray) {
            toast.error(`${error.message}`);
          }
        });
    }

    return {
      donation,
      storeDonation,
      isiNominal,
      goBack,
      addQuickPray,
    };
  },
};
</script>
