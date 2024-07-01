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
      <template v-if="!userJSON && !doesNeedsName">Loading...</template>
      <template v-else-if="userJSON && !doesNeedsName">
        <NuxtLink :to="{ name: 'galleries', query: { fullName } }"
          >Your gallery</NuxtLink
        >
      </template>
      <div
        v-if="!doesNeedsName && fullName"
        class="cursor-pointer"
        @click="isUserMenuOpen = !isUserMenuOpen"
      >
        Hi, {{ fullName }}
      </div>
      <!-- <div
        v-if="isUserMenuOpen"
        class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none top-14"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabindex="-1"
      >
        <div class="py-1 mr-2" role="none">
          <button
            type="button"
            class="block w-full px-4 py-2 text-left text-sm text-gray-700"
            role="menuitem"
            tabindex="-1"
            id="menu-item-1"
            @click="changeName"
          >
            Change name
          </button>
        </div>
      </div> -->
    </div>

    <h1 class="mt-2 text-3xl font-bold tracking-tight text-red-300 sm:text-4xl">
      Thank you everyone for playing the scavenger photo hunt at our wedding!
    </h1>

    <p class="mt-2 text-xl leading-8 text-gray-700">
      For those looking for photo booth pictures, we'll try to have them up here
      for download in the next couple of days.
    </p>
    <p class="mt-2 text-base leading-8 text-gray-700 float-right">
      - Mr & Mrs Moreno
    </p>

    <!-- <template v-if="doesNeedsName">
      <p class="text-base font-semibold leading-7 text-yellow-900 mt-5">
        Welcome to Dorothy and Patrick's
      </p>
  
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-red-300 sm:text-4xl">
        Wedding scavenger photo hunt at Sage!
      </h1>    
    </template>
    <template v-else>
      <h1 class="mt-6 text-3xl font-bold tracking-tight text-red-300 sm:text-4xl">
        Dorothy and Patrick's wedding scavenger photo hunt
      </h1>
      <p class="mt-2 text-xl leading-8 text-gray-700">
        Select a category you want to upload a photo for, then choose a photo from your album or take a picture, then press submit!
      </p>
      <p class="mt-2 text-base leading-8 text-gray-700">
        If you just want to upload photos, pick the "or upload any picture!" option.
      </p>
    </template>

    <template v-if="doesNeedsName">
      <FullNameInput v-model:fullName="fullName" @saveName="saveName" @getNameBack="getNameBack" :isMutable="allowLocalStorageMutate"/>
      <button
        type="button"
        class="mt-8 flex w-full justify-center rounded-md bg-red-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm enabled:hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-30"
        @click="saveName"
      >
        Enter
      </button>
    </template> -->

    <!-- <template v-else-if="!doesNeedsName && fullName"> -->
    <!-- <template v-if="!doesNeedsName && fullName"> -->
    <!-- <div class="mt-6">
        <svg fill="#000000" height="50px" width="35px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
        viewBox="0 0 330 330" xml:space="preserve">
        <path id="XMLID_24_" d="M216.358,271.76c-2.322-5.605-7.792-9.26-13.858-9.26H180V15c0-8.284-6.716-15-15-15
          c-8.284,0-15,6.716-15,15v247.5h-22.5c-6.067,0-11.537,3.655-13.858,9.26c-2.321,5.605-1.038,12.057,3.252,16.347l37.5,37.5
          C157.322,328.536,161.161,330,165,330s7.678-1.464,10.607-4.394l37.5-37.5C217.396,283.816,218.68,277.365,216.358,271.76z"/>
        </svg>
      </div> -->
    <!-- <p class="mt-6 text-xl leading-8 text-gray-700">Step 1:</p>
      <div class="mt-2">
        <label
          for="email"
          class="block text-sm font-medium leading-6 text-gray-900 mb-2"
          >Select category:</label
        >
        <ul>
          <li
            v-for="item in huntItems"
            class="relative flex gap-x-3"
            :class="completedStyle(item)"
          >
            <div class="flex h-6 items-center">
              <input
                :id="item"
                type="radio"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                v-model="selectedTask"
                :value="item"
              />
            </div>
            <span
              :class="{
                'text-gray-500': selectedTask && selectedTask !== item,
              }"
              class="cursor-pointer"
              @click="selectedTask = item"
              >{{ item }}
              <p
                v-if="selectedTask === item && completedItems.includes(item)"
                class="text-blue-400 ml-3"
              >
                <i
                  >This will replace the previously uploaded photo for the
                  hunt</i
                >
              </p>
            </span>
          </li>
        </ul>
        <div class="mt-4">
          <input
            id="general"
            type="radio"
            class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            v-model="selectedTask"
            value="general"
          />
          <span
            :class="
              ({
                'text-gray-500': selectedTask && selectedTask !== 'general',
              },
              'ml-2')
            "
            class="cursor-pointer"
            @click="selectedTask = 'general'"
          >
            or upload any picture! (Multiple photos allowed)
          </span>
        </div>
      </div>

      <p class="mt-4 text-xl leading-8 text-gray-700">Step 2:</p>

      <div class="mt-2">
        <input
          type="file"
          class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-200 file:text-red-600 hover:file:bg-violet-100"
          :multiple="selectedTask && selectedTask !== 'general' ? null : true"
          ref="fileupload"
          accept="image/*"
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
            <div v-for="photo in photos" :key="photo.name" class="mr-4">
              <img
                class="photo-thumbnail mr-2"
                :src="photo.fileb64String"
                :alt="photo.name"
                height="250"
                width="auto"
                @click="previewPhotoToInspect = photo"
              />
              <button
                type="button"
                class="mt-2 flex w-full justify-center rounded-md bg-red-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm enabled:hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-30 mb-8"
                @click="deleteDraftPhoto(photo)"
              >
                Remove
              </button>
            </div> -->
    <!-- <a v-if="photo.href" :href="photo.href" class="mt-5 flex w-full justify-center rounded-md bg-red-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm enabled:hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-30" download>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </a> -->
    <!-- </div>
        </div> -->

    <!-- <p class="mt-8 text-xl leading-8 text-gray-700">Step 3:</p>

        <button
          type="button"
          class="mt-2 flex w-full justify-center rounded-md bg-red-300 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm enabled:hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-30 mb-8"
          @click="submit"
        >
          <div v-if="isSubmitting" class="circle mr-2 animate-spin"></div>
          Submit
        </button> -->

    <!-- <div>
          {{ seeResponse }}
        </div> -->
    <!-- </div>
    </template> -->
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
  name: "index",
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
      completedItems: [],
      userJSON: null,
      huntItems: [
        "you the bride and groom",
        "you and the flower girl or the ring bearer",
        "you and the sinking boat",
        "the newly weds kiss",
        "you in the rose garden",
        "you and a new friend",
        "you and your table",
        "a toast or cheers",
        "you busting out a move on the dance floor",
        "you and someone related to the bride or groom",
        "something sweet",
        "a lit moment", // TODO uppercase the lit
      ],
      objectives: [],
      selectedTask: "",
      isUserMenuOpen: false,
      allowLocalStorageMutate: false,
    };
  },
  async mounted() {
    const name = localStorage.getItem("name");
    if (name) {
      this.fullName = name;

      this.fetchUserJson();
    } else {
      this.doesNeedsName = true;
    }
  },
  computed: {
    isPhotosFinishedLoading() {
      return this.photos.length === this.filesLength;
    },
  },
  watch: {
    selectedTask: {
      handler: function (newVal) {
        if (newVal !== "general" && this.photos.length > 1) {
          this.photos = [this.photos[0]];
          this.filesLength = 1;
        }
      },
    },
  },
  methods: {
    deleteDraftPhoto(photoName) {
      this.photos = this.photos.filter(
        (photo) => photo.name !== photoName.name
      );
      this.filesLength--;
    },
    async fetchUserJson() {
      // fetch their checklist
      const response = await $fetch(
        `/api/aws/user/s3?name=${encodeURIComponent(this.fullName)}`,
        {
          method: "GET",
        }
      );

      // console.log("check get user", response);

      this.userJSON = response;

      if (this.userJSON.completedTasks) {
        this.completedItems = Object.keys(this.userJSON.completedTasks).map(
          (task: string) => task.replace(/-/g, " ")
        );
      }
    },
    changeName() {
      this.fullName = "";
      localStorage.removeItem("name");
      this.isUserMenuOpen = false;
      // clear the completed, TODO maybe we should grab the userJSON again and fulfill the completedItems. This way online one person is using that name?
      this.completedItems = [];
      this.doesNeedsName = true;
    },
    completedStyle(task: string) {
      if (this.completedItems.includes(task)) {
        if (this.selectedTask !== task) {
          return "text-gray-500 line-through";
        } else if (this.selectedTask === task) {
          return "";
        }
      } else {
        return "";
      }
    },
    getNameBack() {
      this.allowLocalStorageMutate = false;
      this.doesNeedsName = false;
      this.fetchUserJson();
    },
    async saveName() {
      if (this.fullName === "" || this.fullName.trim().length === 0) {
        this.showAlert("Please enter your name", "warning");
        return;
      }

      if (this.fullName === "changelocalstorage") {
        // in case there is an issue with the names
        localStorage.removeItem("name");
        this.fullName = "";
        this.allowLocalStorageMutate = true;

        return;
      }

      let response = null;

      if (!this.allowLocalStorageMutate) {
        // create a JSON for them under name/checklist
        response = await $fetch("/api/aws/user/s3", {
          method: "POST",
          body: {
            name: this.fullName,
          },
        });

        if (response.ok) {
          this.userJSON = response.userJson;
        } else {
          // need to try entering the name again
          this.doesNeedsName = true;
          this.showAlert(
            `Error setting up name - refresh and try again`,
            "danger"
          );
        }
      } else {
        this.fetchUserJson();
        this.allowLocalStorageMutate = false;
      }

      localStorage.setItem("name", this.fullName);
      this.doesNeedsName = false;
    },
    showAlert(msg: string, type: string, duration: number) {
      // TODO need to put this inside alert component and have multiple alerts rendered instead of one alert changing.
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
              href: URL.createObjectURL(file),
            });
          };
        }
      }
    },
    async submit() {
      if (this.isSubmitting) return;
      if (!this.isPhotosFinishedLoading) return;

      this.isSubmitting = true;

      if (this.photos?.length > 0) {
        const response = await $fetch("/api/aws/s3", {
          method: "POST",
          body: {
            photos: this.photos,
            name: this.fullName,
            task: this.selectedTask,
            userJson: this.userJSON,
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

        let errorUploads = response.responses.filter((res: any) => {
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
            `Uploaded ${photoCount} photo${photoCount > 1 ? "s" : ""}`,
            "success"
          );
          this.completedItems.push(this.selectedTask);
          this.$refs.fileupload.value = "";
          this.selectedTask = "";
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

.line-through {
  text-decoration: line-through;
}
</style>
