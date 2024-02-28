<template>
    <div class="px-10 mt-28">
        <NuxtLink to="/pictures">Pictures</NuxtLink>
        <p class="text-base font-semibold leading-7 text-indigo-600 mt-5">Welcome to Dorothy and Patrick's</p>
        <h1 class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Scavenger Hunt!</h1>
        <p class="mt-6 text-xl leading-8 text-gray-700">Take a table selfie with each item or person then upload it here.</p>
        <button @click="test" class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">test</button>
        <UploadForm />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  // type inference enabled
  data() {
    return {
      testing: ''
    };
  },
  methods: {
    async test() {
      console.log("testttt")
      const response = await useFetch('/api/test')
      console.log("show response", response.data._value)
    },
  },
});
</script>

  