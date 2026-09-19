import { createClient } from '@sanity/client';

export const sanityClient = createClient({
    projectId: 'm1jtz9wr',
    dataset: 'production',
    apiVersion: '2026-09-19',
    useCdn: true
});

export async function getExercises() {
    const query = `
    *[_type == "exercise"] | order(name asc) {
      _id,
      exerciseId,
      name,
      muscleGroup,
      muscle,
      equipment,
      type,
      difficulty,
      sets,
      reps,
      weight,
      rest,
      duration,
      distance,
      description,
      instructions,
      tips
    }
  `;

    return await sanityClient.fetch(query);
}