<template>
  <div div class="px-10 mt-8">
    <Alert
      :show="alert?.isShowing"
      :message="alert?.message"
      :type="alert?.type"
    />
    <p class="text-base font-semibold leading-7 text-yellow-900 mt-5">
      See scavenger hunt progress
    </p>

    <p class="mt-6 text-xl leading-8 text-gray-700">
      First to finish: {{ whoFinishedFirst?.name }}
    </p>
    <!-- TODO click Categories title to go to display page and show ALL photos, perfect for a slide show -->
    <p class="mt-6 text-xl leading-8 text-gray-700">
      Categories <button>Slide Show</button> 
    </p>
    <!-- TODO open a new page, pass val in and display photos there -->
    <div v-for="[key, val] in categoryList">
      <p class="mt-2" @click="showPhotos(key)">
        {{ key }} {{ val.length }}
      </p>
      <!-- show and paginate photos -->
      <!-- <div>
        {{val}}
      </div> -->
    </div>

    <div v-if="categoryCurrentlyPreviewing" class="mt-5">Showing {{ categoryCurrentlyPreviewing.replace(/-/g, ' ') }} <button @click="resetShowing">Close showing</button></div>
    <div v-for="photo in currentlyShowingPhotos" class="mt-2">
      <img :src="`https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${photo[Object.keys(photo)[0]]}`" />
    </div>
    <div v-if="isShowingPhotos" class="flex justify-between my-7">
      <button v-if="startPhotoIndex <= 0" class="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
        Previous
      </button>
      <button v-else class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  @click="previousPage">Previous</button>
      <button v-if="endPhotoIndex > currentlyShowingPhotos.length" class="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
        Next
      </button>
      <button v-else class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  @click="nextPage">Next</button>
    </div>

    <p class="mt-8 text-xl leading-8 text-gray-700">
      Guests
    </p>
    <div v-if="users?.length > 0">
      <div v-for="user in users">
        <div class="flex justify-between items-center mt-5">
          <div class="flex items-start flex-col">
            <div class="text-base font-semibold leading-7 text-yellow-900">
              <NuxtLink :to="{ name: 'galleries', query: { fullName: user.name} }">{{user.name}}</NuxtLink>
            </div>
            <div class="ml-3">
              scavenger hunt progress:
              {{ Object.entries(user.completedTasks).length }} / 12
            </div>
            <div class="ml-3">
              general photos uploaded: {{ user.general?.length || 0 }}
            </div>
            <div v-if="user.completedBy" class="ml-3">
              {{new Date(user.completedBy)}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Advanced",
  data() {
    return {
      users: [],
      alert: {},
      selectedUserToShowHuntPhotos: null,
      currentlyShowingPhotos: [],
      startPhotoIndex: 0,
      endPhotoIndex: 10,
      categoryCurrentlyPreviewing: null,
    };
  },
  async mounted () {
    localStorage.setItem("advanced", true);
    // get buckets
    const response = await $fetch(
        `/api/aws/advanced/s3.userObjs`,
        {
          method: "GET",
        }
      );

      this.users = response.reduce((acc, obj)=> {
        if (obj.status !== 'fulfilled') return acc

        acc.push(obj.value)

        return acc
      },[])
  },
  computed: {
    isShowingPhotos () {
      return this.categoryCurrentlyPreviewing && this.currentlyShowingPhotos?.length > 0
    },
    categoryList () {
      // iterate through users completedTasks add each key to a new map, with name and key
      return this.users.reduce((acc, cur) => {
        if (!cur.completedTasks || cur.completedTasks.length === 0) return acc

        Object.entries(cur.completedTasks).forEach(([key, value]) => {
          if (!acc.has(key)) {
            acc.set(key, [{ [cur.name]: value }])
          } else {
            const existing = acc.get(key)
            acc.set(key, [...existing, { [cur.name]: value }])
          }
        })
        return acc
      }, new Map())
    },
    whoFinishedFirst () {
      return this.users.reduce((acc, cur) => {
        if (Object.entries(cur.completedTasks).length === 12) {
          if (!acc) {
            acc = cur
          } else {
            if (cur.completedBy < acc.completedBy) {
              acc = cur
            }
          }
        }
        return acc
      }, null)
    }
  },
  methods: {
    resetShowing() {
      this.categoryCurrentlyPreviewing = null
      this.currentlyShowingPhotos = []
      this.startPhotoIndex = 0
      this.endPhotoIndex = 10
    },
    showPhotos(categoryKey: string) {
      this.categoryCurrentlyPreviewing = categoryKey

      this.currentlyShowingPhotos = this.categoryList.get(categoryKey).slice(0, 10)
      // set currentlyShowingPhotos to photos
    },
    nextPage() {
      if(this.isShowingPhotos) {
        this.startPhotoIndex = this.startPhotoIndex + 10;
        this.endPhotoIndex = this.endPhotoIndex + 10;

        this.currentlyShowingPhotos = this.categoryList.get(this.categoryCurrentlyPreviewing).slice(this.startPhotoIndex, this.endPhotoIndex);
      }
    },
    previousPage() {
      if(this.isShowingPhotos) {
        this.startPhotoIndex = this.startPhotoIndex - 10 < 0 ? 0 : this.startPhotoIndex - 10;
        this.endPhotoIndex = this.endPhotoIndex - 10 < 0 ? 10 : this.endPhotoIndex - 10;

        this.currentlyShowingPhotos = this.categoryList.get(this.categoryCurrentlyPreviewing).slice(this.startPhotoIndex, this.endPhotoIndex);
      }
    },
  }
});
</script>
