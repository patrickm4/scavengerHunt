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

    <div v-if="users?.length > 0">
      <div v-for="user in users">
        <div class="flex justify-between items-center mt-5">
          <div class="flex items-start flex-col">
            <!-- TODO show users photos to verify hunt is correct -->
            <!-- <img
              :src="user?.photo"
              alt="profile"
              class="h-10 w-10 rounded-full"
            /> -->
            <div class="text-base font-semibold leading-7 text-yellow-900">
              {{ user?.name }}
            </div>
            <div class="ml-3">
              scavenger hunt progress:
              {{ Object.entries(user.completedTasks).length }} / 12
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
    console.log("advanced mounted")
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
