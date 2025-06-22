<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div class="bg-white rounded-md shadow-md p-5">
        <div class="text-xl">MASUKKAN NOMINAL DONASI</div>
        <div class="border-2 border-gray-200 mt-3 mb-2"></div>

        <div class="mb-2">
          <label class="mt-2 font-bold text-lg">Rp.</label>
          <input
            type="number"
            class="mt-2 appearance-none w-full bg-gray-200 border border-gray-200 rounded h-15 shadow-sm placeholder-gray-600 focus:outline-none focus:placeholder-gray-600 focus:bg-white focus-within:text-gray-600 p-2 text-right text-xl"
            placeholder="0"
            v-model="donation.amount"
          />
        </div>

        <div class="mb-2">
          <label class="mt-2 font-bold text-lg">Do'a</label>
          <textarea
            rows="3"
            v-model="donation.pray"
            class="mt-2 appearance-none w-full bg-gray-200 border border-gray-200 rounded shadow-sm placeholder-gray-600 focus:outline-none focus:placeholder-gray-600 focus:bg-white focus-within:text-gray-600 p-5"
            placeholder="Tulis Do'a/Ucapan"
          >
          </textarea>
        </div>

        <button
          @click="storeDonation"
          class="mt-4 bg-yellow-500 py-2 rounded-md shadow-md text-base w-full uppercase font-bold focus:outline-none focus:bg-yellow-600"
        >
          LANJUT PEMBAYARAN
        </button>
      </div>
    </div>
  </div>
</template>

<script>
// Vue hooks
import { reactive } from "vue";
// Vuex hook
import { useStore } from "vuex";
// Vue Router hooks
import { useRoute, useRouter } from "vue-router";
// Toast hook
import { useToast } from "vue-toastification";

export default {
  name: "DonationCreateComponent",
  setup() {
    // Initialize Vuex store
    const store = useStore();
    // Initialize Vue Router route
    const route = useRoute();
    // Initialize Vue Router router
    const router = useRouter();
    // Initialize Vue Toastification
    const toast = useToast();

    // Reactive state for donation form data
    const donation = reactive({
      amount: 0, // Donation amount
      pray: "", // Prayer/message from donor
      campaignSlug: route.params.slug, // Campaign slug from route parameters
    });

    /**
     * Function to store the donation.
     * This function is triggered when the "LANJUT PEMBAYARAN" button is clicked.
     */
    function storeDonation() {
      // Frontend validation: check minimum donation amount
      if (donation.amount < 10000) {
        toast.error("Donasi Minimal Rp. 10.000");
        return false; // Prevent further execution
      }

      // Prepare data to be sent to the backend.
      // Ensure field names match backend expectations (e.g., snake_case for Laravel).
      const dataToSend = {
        amount: donation.amount,
        pray: donation.pray,
        campaign_slug: donation.campaignSlug, // Corrected: use snake_case for backend
      };

      // Dispatch the 'storeDonation' action from the 'donation' Vuex module
      store
        .dispatch("donation/storeDonation", dataToSend)
        .then(() => {
          // On successful donation creation
          toast.success("Transaksi Berhasil Dibuat!");
          // Redirect to the donation index page
          router.push({ name: "donation.index" });
        })
        .catch((error) => {
          // On error during donation creation (e.g., validation errors from backend)
          console.error("Error storing donation:", error);

          // Display specific validation errors from backend if available
          if (error.amount) {
            toast.error(`${error.amount[0]}`);
          }
          if (error.pray) {
            toast.error(`${error.pray[0]}`);
          }
          if (error.campaign_slug) {
            // Handle specific error for campaign_slug
            toast.error(`${error.campaign_slug[0]}`);
          }

          // Display general error message from backend if no specific field errors
          if (
            error.message &&
            !error.amount &&
            !error.pray &&
            !error.campaign_slug
          ) {
            toast.error(`${error.message}`);
          }
        });
    }

    // Return reactive state and methods to be used in the template
    return {
      donation, // Reactive state for form inputs
      storeDonation, // Method to handle form submission
    };
  },
};
</script>

<style>
/* You can add custom styles here if needed, or leave it empty if fully using Tailwind */
</style>
