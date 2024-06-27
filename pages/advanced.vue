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
      <p class="mt-2">
        {{ key }}
      </p>
      <!-- <div>
        {{val}}
      </div> -->
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

      console.log("advanced response", response)
      this.users = response.reduce((acc, obj)=> {
        if (obj.status !== 'fulfilled') return acc

        acc.push(obj.value)

        return acc
      },[])
  },
  computed: {
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
  }
});
</script>
