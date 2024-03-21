<template>
  <div @click="$router.go(-1)">Back</div>
  <section>
    <p>See all photos from the wedding!</p>
  </section>
  <div>Show photos here</div>
  <button @click="test">Get Photos</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
 data() {
    return {
      photos: []
    };
  },
  created() {
    // make a call to aws s3 to get the uploaded photos
  },
  methods: {
    async test() {
      const response = await $fetch('/api/aws/s3', {
          method: 'GET'
        })

        console.log("s3 get", response)
    }
  }
});
</script>
  