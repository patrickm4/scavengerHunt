<template>
  <div class="px-10 mt-8">
    <Alert
      :show="alert.isShowing"
      :message="alert.message"
      :type="alert.type"
    />
    <PreviewModal
      v-if="previewPhotoToInspect"
      :photo="previewPhotoToInspect"
      @clearPhotoInspect="previewPhotoToInspect = null"
    />
    <div class="flex justify-between">
      <NuxtLink to="/galleries">Gallery</NuxtLink>
      <span v-if="!doesNeedsName && fullName">Hi, {{ fullName }}</span>
    </div>
    <p class="text-base font-semibold leading-7 text-yellow-900 mt-5">
      Welcome to Dorothy and Patrick's
    </p>
    <!-- <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Scavenger Hunt!</h1> -->
    <!-- <p class="mt-6 text-xl leading-8 text-gray-700">Take a table selfie with each item or person then upload it here.</p> -->
    <!-- <button @click="test" class="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">test</button> -->
    <!-- <UploadForm /> -->

    <h1 class="mt-2 text-3xl font-bold tracking-tight text-red-300 sm:text-4xl">
      Wedding at Sage!
    </h1>
    <p class="mt-6 text-xl leading-8 text-gray-700">
      Upload photos through out the night here.
    </p>

    <template v-if="doesNeedsName">
      <FullNameInput v-model:fullName="fullName" @saveName="saveName" />
      <button
        type="button"
        class="mt-8 flex w-full justify-center rounded-md bg-red-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm enabled:hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-30"
        @click="saveName"
      >
        Enter
      </button>
    </template>

    <template v-else-if="!doesNeedsName && fullName">
      <div class="mt-2">
        <label
          for="email"
          class="block text-sm font-medium leading-6 text-gray-900 mb-2"
          >Upload photos of:</label
        >
        <ul>
          <li v-for="item in huntItems" class="relative flex gap-x-3">
            <div class="flex h-6 items-center">
              <input
                :id="item"
                type="radio"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                v-model="task"
                :value="item"
              />
            </div>
            <span
              :class="{ 'text-gray-500': task && task !== item }"
              class="cursor-pointer"
              @click="task = item"
              >{{ item }}</span
            >
          </li>
        </ul>
        <div class="mt-2">or go ahead and upload any picture!</div>
      </div>

      <div class="mt-10">
        <input
          type="file"
          class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-200 file:text-red-600 hover:file:bg-violet-100"
          multiple
          @change="setPhoto($event)"
        />

        <div v-if="photos?.length > 0" class="mt-4">
          <div
            v-if="!isPhotosFinishedLoading"
            class="w-full info py-3 flex justify-center items-center"
          >
            <div class="circle mr-2 animate-spin"></div>
            loading
          </div>
          <div v-else class="flex thumbnail-container">
            <img
              v-for="photo in photos"
              class="mr-2 photo-thumbnail"
              :src="photo.fileb64String"
              :alt="photo.name"
              height="250"
              width="auto"
              @click="previewPhotoToInspect = photo"
            />
          </div>
        </div>

        <button
          type="button"
          class="mt-8 flex w-full justify-center rounded-md bg-red-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm enabled:hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-30 mb-8"
          @click="submit"
        >
          <div v-if="isSubmitting" class="circle mr-2 animate-spin"></div>
          Submit
        </button>

        <div>
          {{ seeResponse }}
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const array_of_allowed_file_types = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/gif",
];

export default defineComponent({
  // type inference enabled
  data() {
    return {
      testing: "",
      previewPhotoToInspect: null,
      photos: [],
      alert: {
        isShowing: false,
        message: "",
        type: "info",
      },
      seeResponse: "",
      isSubmitting: false,
      filesLength: 0,
      fullName: "",
      doesNeedsName: false,
      huntItems: [
        "you the bride and groom",
        "you and the flower girl or the ring bearer",
        "you and the sinking boat",
        "the newly weds kiss",
        "you in the rose garden",
        "you and a new friend",
        "a selfie with your table",
        "a toast/cheers",
        "you busting out a move on the dance floor",
        "you singing karaoke",
        "something sweet",
        "a LIT moment",
      ],
      objectives: [],
      task: "",
    };
  },
  async mounted() {
    const name = localStorage.getItem("name");
    if (name) {
      this.fullName = name;
      // fetch their checklist
      const response = await $fetch(`/api/aws/user/s3?name=${encodeURIComponent(name)}`, {
          method: "GET"
        });

      console.log("getName json check", response, JSON.parse(response))
    } else {
      this.doesNeedsName = true;
    }
  },
  computed: {
    isPhotosFinishedLoading() {
      return this.photos.length === this.filesLength;
    },
  },
  methods: {
    async saveName() {
      localStorage.setItem("name", this.fullName);
      this.doesNeedsName = false;
      // create a JSON for them under name/checklist
      const response = await $fetch("/api/aws/user/s3", {
          method: "POST",
          body: {
            name: this.fullName,
          },
        });

      console.log("saveName check", response)
    },
    showAlert(msg: string, type: string, duration: number) {
      this.alert.message = msg;
      this.alert.type = type;
      this.alert.isShowing = true;
      setTimeout(() => {
        this.alert.isShowing = false;
        setTimeout(() => {
          this.alert.message = "";
          this.alert.type = "info";
        }, 100);
      }, duration || 5000);
    },
    setPhoto(event: Event) {
      this.filesLength = event.target.files.length || 0;
      this.photos = [];

      if ((event.target as HTMLInputElement)?.files) {
        for (const file of (event.target as HTMLInputElement)?.files) {
          if (!array_of_allowed_file_types.includes(file.type)) {
            this.showAlert("That file is not an image", "warning", 3000);
            this.photos = [];
          }

          const reader = new FileReader();

          reader.readAsDataURL(file);

          reader.onload = (e) => {
            this.photos.push({
              fileb64String: e.target?.result,
              name: file.name,
              type: file.type,
              size: file.size,
            });
          };
        }
      }
    },
    async submit() {
      if (this.isSubmitting) return;
      if (!this.isPhotosFinishedLoading) return;
      if (!this.task) {
        this.showAlert(
          `Please choose which category your photo is in!`,
          "danger"
        );
        return;
      }

      this.isSubmitting = true;

      if (this.photos?.length > 0) {
        const response = await $fetch("/api/aws/s3", {
          method: "POST",
          body: {
            photos: this.photos,
            name: this.fullName,
            task: this.task,
          },
        });

        console.log("s3 response", response);

        if (response?.error) {
          this.photos = [];
          this.showAlert(
            `Error uploading photos - error1: ${response.error}`,
            "danger"
          );
          this.isSubmitting = false;
          return;
        }

        const errorUploads = response.filter((res: any) => {
          return res.status !== "fulfilled";
        });

        if (
          errorUploads &&
          Array.isArray(errorUploads) &&
          errorUploads.length > 0
        ) {
          this.photos = [];
          this.showAlert(`Error uploading photos - error2`, "danger");

          this.seeResponse = JSON.stringify(response);

          this.isSubmitting = false;
        } else {
          const photoCount = this.photos.length;
          this.photos = [];
          this.showAlert(
            `Successfully uploaded ${photoCount} photo${
              photoCount > 1 ? "s" : ""
            }`,
            "success"
          );
          this.isSubmitting = false;
        }
      } else {
        this.showAlert("Please select photos to upload.", "warning");
        this.isSubmitting = false;
      }
    },
  },
});
</script>

<style>
.photo-thumbnail {
  object-fit: contain;
  cursor: pointer;
  height: auto !important;
  width: 100px !important;
}
.thumbnail-container {
  overflow-x: auto;
}
.circle {
  margin-top: 0.1rem;
  border-radius: 50%;
  border: 3px solid;
  height: 20px;
  width: 20px;
  border-bottom-color: #ddd;
  border-left-color: #ddd;
  border-right-color: #ddd;
  border-top-color: #fff;
}
</style>
