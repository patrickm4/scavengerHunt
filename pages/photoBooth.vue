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
        Photo Booth photos ({{ generalPhotos?.length || 0 }})
        <hr>
        <p class="mt-2">
          To download, tap the picture then tap the download icon in the top right corner.
        </p>
      </p>
      <div v-if="!generalPhotos && isShowingGeneralPhotos">No photo booth pics uploaded</div>
      <div v-else-if="generalPhotos">
        <div class="mb-2" v-for="photo in currentlyShowingGeneralPhotos">
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
  name: "PhotoBooth",
 data() {
    return {
      photos: [],
      alert: {
        isShowing: false,
        message: '',
        type: 'info',
      },
      generalPhotos: [],
      currentlyShowingGeneralPhotos: [],// this will have at most 10 photos showing at a time, test with 5 at a time
      startPhotoIndex: 0,
      endPhotoIndex: 10,
      isShowingGeneralPhotos: false,
      photoToInspect: null
    };
  },
  async mounted () {
    const response = await $fetch(
      `/api/aws/user/s3?name=${encodeURIComponent('Esther Young')}`,
      {
        method: "GET",
      }
    );

    this.generalPhotos = response.general;
    if (this.generalPhotos?.length > 0) {
      this.currentlyShowingGeneralPhotos = this.generalPhotos.slice(0, 10);
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
  