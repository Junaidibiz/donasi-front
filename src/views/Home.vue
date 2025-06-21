<template>
  <div class="pb-20 pt-20">
    <!-- Panggil komponen Slider di sini -->
    <SliderComponent />
    <div class="text-center mt-5">INI ADALAH HALAMAN UTAMA (HOMEPAGE)</div>
  </div>
</template>

<script>
import SliderComponent from "../components/Slider.vue"; // Import komponen Slider

export default {
  name: "HomePage",
  components: {
    SliderComponent, // Daftarkan komponen Slider
  },
};
</script>

<style></style>
