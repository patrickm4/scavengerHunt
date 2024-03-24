<template>
  <div @click="$router.go(-1)">Back</div>
  <section>
    <p>See all photos from the wedding!</p>
  </section>
  <div>Show photos here</div>
  <div v-if="photos?.length > 0">
    <img 
      v-for="img in photos" 
      :src="img"
    />
  </div>
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
        if (response) {
          // this.photos = response.contents.map(content => {

          //   `https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${content.key}`
          // })

          this.photos = response.Contents.reduce((acc, cur) => {
            // TODO maybe filter out any file that doesnt end in .jpg or .png?
            console.log("currr", cur)
            if (cur.Size !== 0) {
              acc.push(`https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${cur.Key}`)
            }

            return acc
          }, [])
        }
    }
  }
});
</script>
  