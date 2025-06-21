<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <!-- slider -->
      <div class="grid grid-cols-1 bg-white rounded shadow-md p-1 text-sm mb-5">
        <!-- Added mb-5 for spacing -->
        <SliderComponent />
        <!-- Using PascalCase for component name -->
      </div>

      <!-- categoryHome -->
      <CategoryHomeComponent />
      <!-- Using PascalCase for component name -->

      <!-- campaign (placeholder for future content) -->
    </div>
  </div>
</template>

<script>
// Component slider
import SliderComponent from "../../components/Slider.vue"; // Correct path and PascalCase
// Component categoryHome
import CategoryHomeComponent from "../../components/CategoryHome.vue"; // Correct path and PascalCase

export default {
  name: "HomeComponent",
  components: {
    SliderComponent, // <-- register component Slider
    CategoryHomeComponent, // <-- register component CategoryHome
  },
};
</script>

<style>
/* Anda dapat menambahkan gaya khusus di sini jika diperlukan, atau biarkan kosong jika sepenuhnya menggunakan Tailwind */
</style>
