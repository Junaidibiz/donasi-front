<template>
  <div>
    <div v-if="sliders.length > 0">
      <vueper-slides slide-image-inside autoplay>
        <template v-slot:arrow-left>
          <i class="icon icon-arrow-left" />
        </template>
        <!-- KOREKSI: Gunakan slider.imageUrlComputed untuk gambar -->
        <vueper-slide
          v-for="(slider, i) in sliders"
          :key="i"
          :image="slider.imageUrlComputed"
          :link="slider.link"
        />
        <template v-slot:arrow-right>
          <i class="icon icon-arrow-right" />
        </template>
      </vueper-slides>
    </div>
    <div v-else>
      <ContentLoader />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { ContentLoader } from "vue-content-loader";
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";

export default {
  name: "SliderComponent",
  components: {
    ContentLoader,
    VueperSlides,
    VueperSlide,
  },
  setup() {
    const store = useStore();

    onMounted(() => {
      store.dispatch("slider/getSlider");
    });

    const sliders = computed(() => {
      // KOREKSI: Map data slider untuk menambahkan properti imageUrlComputed
      return store.state.slider.sliders.map((slider) => {
        const LARAVEL_STORAGE_BASE_URL = "http://donasi-dm.test"; // <-- SESUAIKAN DENGAN BASE URL DOMAIN BACKEND ANDA
        // Jika path gambar dimulai dengan /storage, tambahkan base URL domain
        const imageUrl = slider.image.startsWith("/storage")
          ? `${LARAVEL_STORAGE_BASE_URL}${slider.image}`
          : slider.image;
        return {
          ...slider,
          imageUrlComputed: imageUrl,
        };
      });
    });

    return {
      sliders,
    };
  },
};
</script>

<style scoped>
.vueperslide__image {
  transform: scale(1.5) rotate(-10deg);
}
.vueperslide__title {
  font-size: 7em;
  opacity: 0.7;
}
</style>
