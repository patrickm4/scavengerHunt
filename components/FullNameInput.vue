<template>
  <div class="mt-5">
    <div v-if="isMutable">Changing Local storage</div>
    <label v-else>Enter your full name to start</label>
    <input
      :value="fullName"
      @input="$emit('update:fullName', $event.target.value)"
      id="name"
      autocomplete="off"
      required
      class="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      @keyup.enter="$emit('saveName')"
    />
  </div>
</template>

<script>
export default {
  props: {
    fullName: String,
    isMutable: Boolean,
  },
  emits: ["update:fullName"],
};
</script>
