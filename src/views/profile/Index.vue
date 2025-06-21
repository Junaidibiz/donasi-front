<template>
  <div class="pb-20 pt-20">
    <div class="container mx-auto grid grid-cols-1 p-3 sm:w-full md:w-5/12">
      <form
        @submit.prevent="updateProfile"
        method="POST"
        enctype="multipart/form-data"
      >
        <div class="bg-white p-5 rounded-md shadow-md mb-5">
          <div class="flex flex-col justify-center items-center relative">
            <div>
              <!-- Using avatarUrlComputed for avatar URL -->
              <img
                :src="avatarUrlComputed"
                class="rounded-full w-28 h-28 object-cover"
              />
            </div>
            <div class="mt-4 flex space-x-2">
              <!-- Custom button for file input -->
              <label
                for="avatar-upload"
                class="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow-sm text-sm"
              >
                {{
                  profile.avatar || imageAvatar
                    ? "Select A New Photo"
                    : "Pilih Foto Avatar"
                }}
              </label>
              <!-- Hidden file input -->
              <input
                id="avatar-upload"
                type="file"
                class="hidden"
                accept="image/*"
                @change="onFileChange"
              />
              <!-- Remove Photo button, displayed if there's an avatar or a new image selected -->
              <button
                v-if="profile.avatar || imageAvatar"
                @click.prevent="removePhoto"
                class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow-sm text-sm"
              >
                Remove Photo
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white p-3 rounded-md shadow-md">
          <div class="grid grid-cols-1 gap-4">
            <div class="mb-2">
              <label class="mt-2" for="profile-name">Nama Lengkap</label>
              <input
                type="text"
                id="profile-name"
                class="mt-2 appearance-none w-full bg-gray-200 rounded h-7 shadow-sm placeholder-gray-700 focus:outline-none focus:placeholder-gray-600 focus:bg-gray-300 focus-within:text-gray-600 p-5"
                placeholder="Nama Lengkap"
                v-model="profile.name"
              />
            </div>

            <div class="mb-2">
              <label class="mt-2" for="profile-email">Alamat Email</label>
              <input
                type="email"
                id="profile-email"
                class="mt-2 appearance-none w-full bg-gray-200 opacity-70 rounded h-7 shadow-sm placeholder-gray-600 focus:outline-none focus:placeholder-gray-600 focus:bg-gray-300 focus-within:text-gray-600 p-5"
                v-model="profile.email"
                placeholder="Alamat Email"
              />
            </div>

            <div>
              <button
                type="submit"
                class="mt-3 bg-gray-700 text-white p-2 w-full rounded-md shadow-md focus:outline-none"
              >
                UPDATE PROFILE
              </button>
            </div>
          </div>
        </div>
      </form>
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
      // Prioritize newly selected image (for preview)
      if (imageAvatar.value) {
        return URL.createObjectURL(imageAvatar.value);
      }
      // If no new image, use logic from backend/ui-avatars
      if (profile.value && profile.value.name) {
        if (profile.value.avatar) {
          // !!! IMPORTANT: ADJUST YOUR LARAVEL STORAGE BASE URL HERE !!!
          // Example: 'http://localhost:8000/storage/' or 'http://donasi-dm.test/storage/donaturs/'
          const LARAVEL_STORAGE_BASE_URL =
            "http://donasi-dm.test/storage/donaturs/"; // <-- ADJUST THIS

          // Check if avatar is already a full URL or just a filename
          if (
            profile.value.avatar.startsWith("http://") ||
            profile.value.avatar.startsWith("https://")
          ) {
            return profile.value.avatar; // If already full URL, use it directly
          } else {
            // If only filename, prepend base storage URL
            return `${LARAVEL_STORAGE_BASE_URL}${profile.value.avatar}`;
          }
        } else {
          // Fallback to UI-Avatars.com if 'avatar' property from backend is null or empty
          // This handles cases where backend returns null for default avatars
          return `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.value.name
          )}&background=random&color=fff&size=128`;
        }
      }
      return ""; // Fallback if no profile data or name is available
    });

    function onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        imageAvatar.value = file;
        if (!file.type.match("image.*")) {
          e.target.value = ""; // Clear file input
          imageAvatar.value = null;
          toast.error("File extension not allowed!");
        }
      }
    }

    // Function to remove avatar (triggers backend deletion)
    function removePhoto() {
      // Call Vuex action to remove from backend
      store
        .dispatch("profile/removeUserAvatar")
        .then(() => {
          // If backend deletion is successful, update frontend display
          imageAvatar.value = null; // Clear preview
          const fileInput = document.getElementById("avatar-upload");
          if (fileInput) {
            fileInput.value = "";
          }
          toast.success("Profile photo successfully removed!");
        })
        .catch((error) => {
          console.error("Failed to remove profile photo:", error);
          toast.error("Failed to remove profile photo.");
        });
    }

    function updateProfile() {
      let formData = new FormData();
      // Append avatar only if a new file is selected or if it's explicitly being set to null (removed)
      if (imageAvatar.value) {
        formData.append("avatar", imageAvatar.value);
      } else if (profile.value.avatar === null) {
        // If 'Remove Photo' was clicked and no new file was selected,
        // send an empty string to backend to indicate deletion (if backend supports this)
        formData.append("avatar", "");
      }
      // Append other profile data
      formData.append("name", profile.value.name);
      formData.append("email", profile.value.email);
      // Important for Laravel POST updates (to override method to PUT/PATCH)
      formData.append("_method", "POST");

      store
        .dispatch("profile/updateProfile", formData)
        .then(() => {
          router.push({ name: "dashboard" });
          toast.success("Profile successfully updated!");
          imageAvatar.value = null; // Clear preview after successful upload
        })
        .catch((error) => {
          validation.value = error;
          // Display specific validation errors
          if (validation.value.name) {
            toast.error(`${validation.value.name[0]}`);
          }
          if (validation.value.email) {
            toast.error(`${validation.value.email[0]}`);
          }
          // Display general backend error message
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
      toast,
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

<style>
/* You can add custom styles here if needed, or leave it empty if fully using Tailwind */
</style>
