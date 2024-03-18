<template>
    <div class="px-10 mt-28">
      <Alert :show="isSubmitSuccess"/>
      <PreviewModal 
        v-if="previewPhotoToInspect"
        :photo="previewPhotoToInspect"
        @clearPhotoInspect="previewPhotoToInspect = null"
      />
        <NuxtLink to="/pictures">Pictures</NuxtLink>
        <p class="text-base font-semibold leading-7 text-yellow-900 mt-5">Welcome to Dorothy and Patrick's</p>
        <!-- <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Scavenger Hunt!</h1> -->
        <!-- <p class="mt-6 text-xl leading-8 text-gray-700">Take a table selfie with each item or person then upload it here.</p> -->
        <!-- <button @click="test" class="mt-6 block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">test</button> -->
        <!-- <UploadForm /> -->
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-red-300 sm:text-4xl">Wedding at Sage!</h1>
        <p class="mt-6 text-xl leading-8 text-gray-700">Upload photos through out the night here.</p>
        <div class="mt-10">
          <input
            type="file"
            class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-200 file:text-red-600 hover:file:bg-violet-100"
            multiple
            @change="setPhoto($event)"
          />

          <div v-if="photos?.length > 0" class="mt-4">
            <div class="flex thumbnail-container">
              <img v-for="photo in photos" class="mr-2 photo-thumbnail" :src="photo.fileb64String" :alt="photo.name" height="250" width="auto" @click="previewPhotoToInspect = photo"/>
            </div>
          </div>

          <button
            type="button"
            class="mt-8 flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm enabled:hover:bg-yellow-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-30"
            :disabled="photos?.length <= 0"
            @click="submit"
          >
                Submit
          </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  // type inference enabled
  data() {
    return {
      testing: '',
      previewPhotoToInspect: null,
      photos: [],
      isSubmitSuccess: false,
    };
  },
  methods: {
    setPhoto(event: Event) {
      this.photos = []

      if ((event.target as HTMLInputElement)?.files) {
        for (const file of (event.target as HTMLInputElement)?.files) {
          const reader = new FileReader();

          reader.readAsDataURL(file)

          reader.onload = (e) => {
            this.photos.push({
              fileb64String: e.target?.result,
              name: file.name,
              type: file.type,
              size: file.size
            })
          }
        }
      }
    },
    async submit() {      
      if (this.photos) {
        const response = await $fetch('/api/aws/s3', {
          method: 'POST',
          body: {
            photos: this.photos
          }
        })
        console.log("s3 response", response)
        const errorUploads = response.filter(res => {
          return res.status !== 'fulfilled'
        })

        if (errorUploads && Array.isArray(errorUploads) && errorUploads.length > 0) {
          // show error alert
        } else {
          this.isSubmitSuccess = true
          this.photos = []
          setTimeout(() => {
            this.isSubmitSuccess = false
          }, 3000)  
        }
      } else {
        console.log("no photo submitted")
      }
    },
  },
});
</script>

<style>
.photo-thumbnail {
  object-fit: contain;
  cursor:pointer;
  height: auto !important;
  width:100px !important;
}
.thumbnail-container {
  overflow-x: auto
}
</style>