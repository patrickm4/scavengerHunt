<template>
  <div div class="px-10 mt-8">
    <Alert :show="alert.isShowing" :message="alert.message" :type="alert.type"/>
    <PreviewModal
      v-if="photoToInspect"
      :photo="photoToInspect"
      @clearPhotoInspect="photoToInspect = null"
    />
    <div @click="$router.go(-1)">Back</div>
    <div class="mt-5">
      <p class="mt-6 text-xl leading-8 text-gray-700">
        Scavenger hunt photos {{ `(${Object.keys(completedTasks)?.length || 0}/12)` }}
      </p>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="isShowingCompletedTasks = !isShowingCompletedTasks">
        {{ isShowingCompletedTasks ? 'Hide' : 'Show'}} scavenger hunt photos
      </button><div v-if="!completedTasks && isShowingCompletedTasks">No scavenger hunt photos uploaded</div>
      <div v-else-if="completedTasks && isShowingCompletedTasks">
        <div v-for="(value, key) in completedTasks">
          <p class="mt-6 text-xl leading-8 text-gray-700">
            {{ hyphenToTitleCase(key) }}
          </p>
          <!-- TODO change fileb64String to something more appropriate -->
          <img :src="`https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${value}`" @click="photoToInspect = {
            fileb64String: `https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${value}`,
            href: `https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${value}`
          }" />
        </div>
      </div>
    </div>
    <div class="mt-5">
      <p class="mt-6 text-xl leading-8 text-gray-700">
        General photos ({{ generalPhotos?.length || 0 }})
      </p>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-7" @click="isShowingGeneralPhotos = !isShowingGeneralPhotos">
        {{ isShowingGeneralPhotos ? 'Hide' : 'Show'}}  general photos
      </button>
      <div v-if="!generalPhotos && isShowingGeneralPhotos">No general photos uploaded</div>
      <div v-else-if="generalPhotos && isShowingGeneralPhotos">
        <div class="mb-2" v-for="photo in currentlyShowingGeneralPhotos">
          <!-- TODO change fileb64String to something more appropriate -->
          <img :src="`https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${photo}`" @click="photoToInspect = {
            fileb64String: `https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${photo}`,
            href: `https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${photo}`
          }" />
        </div>
        <div class="flex justify-between my-7">
          <button v-if="startPhotoIndex <= 0" class="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
            Previous
          </button>
          <button v-else class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  @click="previousPage">Previous</button>
          <button v-if="endPhotoIndex >= generalPhotos.length" class="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
            Next
          </button>
          <button v-else class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  @click="nextPage">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Galleries",
 data() {
    return {
      photos: [],
      alert: {
        isShowing: false,
        message: '',
        type: 'info',
      },
      completedTasks: {},
      generalPhotos: [],
      currentlyShowingGeneralPhotos: [],// this will have at most 10 photos showing at a time, test with 5 at a time
      startPhotoIndex: 0,
      endPhotoIndex: 10,
      isShowingGeneralPhotos: false,
      isShowingCompletedTasks: false,
      photoToInspect: null
    };
  },
  async mounted () {
    const queryName = this.$route.query.fullName;
    const name = localStorage.getItem("name");
    const isAdvanced = localStorage.getItem("advanced");

    if (name === queryName || isAdvanced) {
      const response = await $fetch(
        `/api/aws/user/s3?name=${encodeURIComponent(queryName)}`,
        {
          method: "GET",
        }
      );

      this.completedTasks = response.completedTasks;
      this.generalPhotos = response.general;
      if (this.generalPhotos?.length > 0) {
        this.currentlyShowingGeneralPhotos = this.generalPhotos.slice(0, 10);
      }
    }
  },
  methods: {
    nextPage() {
      this.startPhotoIndex = this.startPhotoIndex + 10;
      this.endPhotoIndex = this.endPhotoIndex + 10;
      this.currentlyShowingGeneralPhotos = this.generalPhotos.slice(this.startPhotoIndex, this.endPhotoIndex);
    },
    previousPage() {
      this.startPhotoIndex = this.startPhotoIndex - 10 < 0 ? 0 : this.startPhotoIndex - 10;
      this.endPhotoIndex = this.endPhotoIndex - 10 < 0 ? 10 : this.endPhotoIndex - 10;
      this.currentlyShowingGeneralPhotos = this.generalPhotos.slice(this.startPhotoIndex, this.endPhotoIndex);
    },
    hyphenToTitleCase(input: string): string {
      return input
        .split('-') // Split the string by hyphens
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Convert each word to Title Case
        .join(' '); // Join the words back with spaces
    },
    showAlert(msg: string, type: string) {
      this.alert.message = msg
      this.alert.type = type
      this.alert.isShowing = true
      setTimeout(() => {
        this.alert.isShowing = false
        setTimeout(() => {
          this.alert.message = ''
          this.alert.type = 'info'
        },100)
      }, 3000)  
    },
  }
});
</script>
  