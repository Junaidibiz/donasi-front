<template>
  <div class="h-screen">
    <Header />

    <router-view></router-view>

    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue"; // Import komponen Header
import Footer from "./components/Footer.vue"; // Import komponen Footer

export default {
  name: "AppComponent",
  components: {
    Header, // Daftarkan komponen Header
    Footer, // Daftarkan komponen Footer
  },
};
</script>

<style>
/* Styling di sini jika diperlukan, atau biarkan kosong jika sepenuhnya menggunakan Tailwind */
</style>
