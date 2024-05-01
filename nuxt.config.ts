// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '~/assets/_colors.css'
  ],
  devServer: {
    host: '192.168.1.83',
    port: 3000
  }
  // vite: {
  //   css: {
  //     preprocessorOptions: {
  //       scss: {
  //         additionalData: '@use "~/assets/_colors.scss" as *;'
  //       }
  //     }
  //   }
  // }
})
