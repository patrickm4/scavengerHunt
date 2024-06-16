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
    <!-- TODO -->
    <!-- need to see everyones progress -->
    <!-- if they've completed all tasks, maybe how many they have? -->
    <!-- who finished first -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Advanced",
  data() {
    return {
      photos: [],
      alert: {},
    };
  },
});
</script>
