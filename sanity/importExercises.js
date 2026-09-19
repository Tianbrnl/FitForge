import 'dotenv/config'
import { createClient } from '@sanity/client'
import { exercisesData } from '../src/data/exercises.js'
console.log('Token loaded:', !!process.env.SANITY_TOKEN)
const client = createClient({
    projectId: 'm1jtz9wr',
    dataset: 'production',
    apiVersion: '2026-09-19',
    token: process.env.SANITY_TOKEN,
    useCdn: false,

})

const documents = exercisesData.map((exercise) => {
    const document = {
        _id: exercise.id,
        _type: 'exercise',
        exerciseId: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        muscle: exercise.muscle,
        equipment: exercise.equipment,
        type: exercise.type,
        difficulty: exercise.difficulty,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        rest: exercise.rest,
        description: exercise.description,
        instructions: exercise.instructions,
        tips: exercise.tips,
    }

    if (exercise.duration !== undefined) {
        document.duration = exercise.duration
    }

    if (exercise.distance !== undefined) {
        document.distance = exercise.distance
    }

    return document
})

async function importExercises() {
    console.log(`Importing ${documents.length} exercises...`)

    const transaction = client.transaction()

    documents.forEach((document) => {
        transaction.createOrReplace(document)
    })

    await transaction.commit()

    console.log(`Successfully imported ${documents.length} exercises!`)
}

importExercises().catch((error) => {
    console.error('Import failed:', error)
    process.exit(1)
})