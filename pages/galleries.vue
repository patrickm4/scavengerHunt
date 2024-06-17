<template>
  <div div class="px-10 mt-8">
    <Alert :show="alert.isShowing" :message="alert.message" :type="alert.type"/>
    <div @click="$router.go(-1)">Back</div>
    <div v-if="completedTasks">
      <div v-for="(value, key) in completedTasks">
        <p class="mt-6 text-xl leading-8 text-gray-700">
          {{ hyphenToTitleCase(key) }}
        </p>
        <img :src="`https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${value}`" />
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
      completedTasks: null
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
    }
  },
  methods: {
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
  