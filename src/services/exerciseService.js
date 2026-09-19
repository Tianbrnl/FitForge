import { sanityClient } from './sanity';


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

  const exercises = await sanityClient.fetch(query);

  return exercises.map((exercise) => ({
    ...exercise,
    id: exercise.exerciseId || exercise._id,
  }));
}