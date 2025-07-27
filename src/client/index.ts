import { createClient } from "@hey-api/client-fetch"

const baseUrl = process.env.EXPO_PUBLIC_API_URL

export const ApiClient = createClient({
    baseUrl,
})

console.log('base url: ', baseUrl)