<template>
  <div div class="px-10 bg-gray-900 text-white">
    <p class="text-lg font-semibold leading-7 text-white pt-10">
      See scavenger hunt progress
    </p>

    <p class="mt-6 text-xl leading-8 text-gray-200">
      First to finish: {{ listOfWhoFinishedAscending[0]?.name }}
    </p>

    <p class="mt-2 text-xl leading-8 text-gray-200">
      Runner ups
        <div v-for="(userObj, index) in listOfWhoFinishedAscending">
          <span v-if="index !== 0">
            {{ `${index + 1}nd` }} - {{ userObj.name }}
          </span>
        </div>
    </p>
    <!-- TODO click Categories title to go to display page and show ALL photos, perfect for a slide show -->
    <p class="mt-6 text-xl leading-8 text-gray-200">
      Categories 
      <!-- <button>Slide Show</button>  -->
    </p>
    <div v-for="[key, val] in categoryList">
      <div class="mt-2">
        <span class="cursor-pointer" @click="showPhotos(key)">{{ key }} {{ val.length }}</span>
      </div>
    </div>

    <div v-if="categoryCurrentlyPreviewing" class="mt-5">
      Showing {{ categoryCurrentlyPreviewing.replace(/-/g, ' ') }} 
      <button @click="resetShowing">Close showing</button>
    </div>

    <div class="img-container">
      <div v-for="photo in currentlyShowingPhotos" class="mt-2">
        <img :src="`https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${photo[Object.keys(photo)[0]]}`" class="category-img"/>
      </div>
      <div v-if="isShowingPhotos" class="flex justify-between w-1/2 my-7">
        <button v-if="startPhotoIndex <= 0" class="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
          Previous
        </button>
        <button v-else class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  @click="previousPage">Previous</button>
        <button v-if="endPhotoIndex > currentlyShowingPhotos.length" class="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed">
          Next
        </button>
        <button v-else class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"  @click="nextPage">Next</button>
      </div>
    </div>

    <p class="mt-8 text-xl leading-8 text-gray-200">
      Guests
    </p>
    <div v-if="users?.length > 0">
      <div v-for="user in users">
        <div class="flex justify-between items-center mt-4">
          <div class="flex items-start flex-col">
            <div class="text-base font-semibold leading-7 text-blue-300">
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
              Finished scavenger hunt at {{new Date(user.completedBy)}}
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
    listOfWhoFinishedAscending () {
      return this.users.reduce((acc, cur) => {
        if (Object.entries(cur.completedTasks).length === 12) {
          acc.push(cur)
        }
        return acc
      }, []).sort((a, b) => a.completedBy - b.completedBy)
    },
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

<style>
.category-img {
  height:90vh;
  width: auto
}
.img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
