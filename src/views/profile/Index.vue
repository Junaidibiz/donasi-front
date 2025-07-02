<template>
  <div class="pb-20 pt-24">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <div
        class="bg-white w-full max-w-2xl rounded-xl shadow-lg overflow-hidden mx-auto"
      >
        <div class="flex flex-col items-center text-center p-6 space-y-4">
          <img
            :src="avatarUrlComputed"
            alt="Foto Profil"
            class="w-24 h-24 rounded-full border-4 border-gray-200 shadow-md object-cover"
          />
          <div class="flex gap-4">
            <label
              for="avatar-upload"
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Pilih Foto Baru
            </label>
            <input
              id="avatar-upload"
              type="file"
              class="hidden"
              @change="onFileChange"
              accept="image/*"
            />

            <button
              v-if="profile.avatar || imageAvatar"
              @click.prevent="removePhoto"
              class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm font-medium flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-4 h-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Hapus Foto
            </button>
          </div>
        </div>

        <form
          @submit.prevent="updateProfile"
          class="p-6 space-y-4 border-t border-gray-100"
        >
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Nama Lengkap</label
            >
            <input
              v-model="profile.name"
              type="text"
              id="name"
              class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Alamat Email</label
            >
            <input
              v-model="profile.email"
              type="email"
              id="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
              disabled
            />
          </div>
          <button
            type="submit"
            class="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition font-medium text-sm flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            Update Profil
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

export default {
  name: "ProfileComponent",
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    onMounted(() => {
      store.dispatch("profile/getProfile");
    });

    const profile = computed(() => {
      return store.state.profile.profile;
    });

    const imageAvatar = ref(null);
    const validation = ref([]);

    const avatarUrlComputed = computed(() => {
      if (imageAvatar.value) {
        return URL.createObjectURL(imageAvatar.value);
      }
      if (profile.value && profile.value.name) {
        if (profile.value.avatar) {
          const LARAVEL_STORAGE_BASE_URL =
            "http://donasi-dm.test/storage/donaturs/";
          if (
            profile.value.avatar.startsWith("http://") ||
            profile.value.avatar.startsWith("https://")
          ) {
            return profile.value.avatar;
          } else {
            return `${LARAVEL_STORAGE_BASE_URL}${profile.value.avatar}`;
          }
        } else {
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.value.name
          )}&background=random&color=fff&size=128`;
        }
      }
      return "";
    });

    function onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.match("image.*")) {
          e.target.value = "";
          toast.error("Tipe file tidak diizinkan!");
          return;
        }
        imageAvatar.value = file;
      }
    }

    // FUNGSI REMOVEPHOTO DIPERBARUI UNTUK MEMANGGIL VUEX ACTION
    function removePhoto() {
      if (window.confirm("Apakah Anda yakin ingin menghapus foto profil?")) {
        store
          .dispatch("profile/removeAvatar")
          .then(() => {
            toast.success("Foto profil berhasil dihapus.");
            imageAvatar.value = null;
            const fileInput = document.getElementById("avatar-upload");
            if (fileInput) {
              fileInput.value = "";
            }
          })
          .catch((error) => {
            toast.error(error.message || "Gagal menghapus foto profil.");
            console.error(error);
          });
      }
    }

    function updateProfile() {
      let formData = new FormData();
      formData.append("name", profile.value.name);
      formData.append("email", profile.value.email);

      if (imageAvatar.value) {
        formData.append("avatar", imageAvatar.value);
      }

      formData.append("_method", "POST");

      store
        .dispatch("profile/updateProfile", formData)
        .then(() => {
          router.push({ name: "dashboard" });
          toast.success("Profil berhasil diupdate!");
          imageAvatar.value = null;
        })
        .catch((error) => {
          validation.value = error;
          if (validation.value.name) {
            toast.error(`${validation.value.name[0]}`);
          }
          if (validation.value.email) {
            toast.error(`${validation.value.email[0]}`);
          }
          if (
            validation.value.message &&
            !validation.value.name &&
            !validation.value.email
          ) {
            toast.error(`${validation.value.message}`);
          }
        });
    }

    return {
      profile,
      validation,
      onFileChange,
      removePhoto,
      updateProfile,
      avatarUrlComputed,
      imageAvatar,
    };
  },
};
</script>
