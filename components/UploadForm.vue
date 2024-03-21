<template>
  <div class="mt-2 flex flex-col">
    <!-- <label>Table number</label>
        <input type="text"/> -->

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
      <form class="space-y-6" action="#" method="POST">
        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >First type your table number</label
          >
          <div class="mt-2">
            <input
              v-model="tableNumber"
              id="email"
              type="number"
              autocomplete="email"
              required
              @focus="$event.target.select()"
              class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div v-if="tableNumber">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900 mb-2"
            >Second take a table selfie with ...</label
          >
          <ul>
            <li v-for="item in huntItems" class="relative flex gap-x-3">
              <div class="flex h-6 items-center">
                <input
                  id="comments"
                  name="comments"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  v-model="objectives"
                  :value="item"
                />
              </div>
              {{ item }}
            </li>
          </ul>
        </div>

        <div v-if="tableNumber && objectives?.length > 0">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900 mb-2"
            >Upload Photo</label
          >
          <input
            type="file"
            class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            @change="setPhoto($event)"
          />

          <div>
            <button
              type="submit"
              class="mt-8 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              @click.prevent="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  // type inference enabled
  data() {
    return {
      tableNumber: 0,
      objectives: [],
      huntItems: ["Something blue", "Someone with Tattoos"],
      photo: null,
    };
  },
  methods: {
    setPhoto(event: Event) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target?.files[0])

      reader.onload = (event) => {
        this.photo = event.target?.result
      }

    },
    async submit() {
      //upload photo to aws
      
      if (this.photo) {
        const response = await $fetch('/api/aws/s3', {
          method: 'POST',
          body: {
            photo: this.photo
          }
        })
      }
    },
  },
});
</script>