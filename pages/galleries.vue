<template>
  <div div class="px-10 mt-8">
    <Alert :show="alert.isShowing" :message="alert.message" :type="alert.type"/>
    <div @click="$router.go(-1)">Back</div>
    <!-- <section>
      <p>See all photos from the wedding!</p>
    </section>
    <div>Show photos here</div>
    <div v-if="photos?.length > 0">
      <img 
        v-for="img in photos" 
        :src="img"
      />
    </div>
    <button @click="getPhotos">Get Photos</button> -->
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
        type: 'info'
      },
    };
  },
  mounted () {
    console.log("chec kroute params", this.$route.params, this.$route.query)
    const queryName = this.$route.query.fullName;
    const name = localStorage.getItem("name");
    const isAdvanced = localStorage.getItem("advanced");

    console.log("gallery check queryName", queryName)
    console.log("gallery check name", name)
    if (name === queryName || isAdvanced) {
      console.log("gallery check name match")
    }
  },
  methods: {
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
    // async getPhotos() {
    //   const response = await $fetch('/api/aws/s3', {
    //       method: 'GET'
    //     })

    //     console.log("s3 get", response)

    //     if (response?.error) {
    //       this.showAlert(`Error uploading photos - error: ${JSON.stringify(response.error)}`, 'danger')
    //     } else {
    //       // this.photos = response.contents.map(content => {

    //       //   `https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${content.key}`
    //       // })

    //       this.photos = response.Contents.reduce((acc, cur) => {
    //         // TODO maybe filter out any file that doesnt end in .jpg or .png?
    //         console.log("currr", cur)
    //         if (cur.Size !== 0) {
    //           acc.push(`https://dopat-scavenger-hunt.s3.us-west-2.amazonaws.com/${cur.Key}`)
    //         }

    //         return acc
    //       }, [])
    //     }
    // }
  }
});
</script>
  