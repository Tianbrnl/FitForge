import { createClient } from '@sanity/client'

export const sanityClient = createClient({
    projectId: 'm1jtz9wr',
    dataset: 'production',
    apiVersion: '2026-09-19',
    useCdn: true,
})