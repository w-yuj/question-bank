export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: '/api/v1',
    onRequest({ options }) {
      // Read the cookie for every request. A ref captured when the plugin is
      // initialized can still contain the pre-login value.
      const token = useCookie<string | null>('token')
      if (token.value) {
        const headers = new Headers(options.headers)
        headers.set('Authorization', `Bearer ${token.value}`)
        options.headers = headers
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        const token = useCookie<string | null>('token')
        token.value = null
        navigateTo('/login')
      }
    }
  })

  return {
    provide: {
      api
    }
  }
})
