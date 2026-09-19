import { defineField, defineType } from 'sanity'

export const exerciseType = defineType({
    name: 'exercise',
    title: 'Exercise',
    type: 'document',

    fields: [
        defineField({
            name: 'exerciseId',
            title: 'Exercise ID',
            type: 'string',
        }),

        defineField({
            name: 'name',
            title: 'Exercise Name',
            type: 'string',
        }),

        defineField({
            name: 'muscleGroup',
            title: 'Muscle Group',
            type: 'string',
            options: {
                list: [
                    'Chest',
                    'Back',
                    'Legs',
                    'Shoulders',
                    'Arms',
                    'Core',
                    'Cardio',
                ],
            },
        }),

        defineField({
            name: 'muscle',
            title: 'Muscle',
            type: 'string',
        }),

        defineField({
            name: 'equipment',
            title: 'Equipment',
            type: 'string',
        }),

        defineField({
            name: 'type',
            title: 'Type',
            type: 'string',
            options: {
                list: ['strength', 'bodyweight', 'cardio'],
            },
        }),

        defineField({
            name: 'difficulty',
            title: 'Difficulty',
            type: 'string',
            options: {
                list: ['Beginner', 'Intermediate', 'Advanced'],
            },
        }),

        defineField({
            name: 'sets',
            title: 'Sets',
            type: 'number',
        }),

        defineField({
            name: 'reps',
            title: 'Reps',
            type: 'number',
        }),

        defineField({
            name: 'weight',
            title: 'Weight',
            type: 'number',
        }),

        defineField({
            name: 'rest',
            title: 'Rest (seconds)',
            type: 'number',
        }),

        defineField({
            name: 'duration',
            title: 'Duration (minutes)',
            type: 'number',
        }),

        defineField({
            name: 'distance',
            title: 'Distance (km)',
            type: 'number',
        }),

        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
        }),

        defineField({
            name: 'instructions',
            title: 'Instructions',
            type: 'array',
            of: [{ type: 'string' }],
        }),

        defineField({
            name: 'tips',
            title: 'Tips',
            type: 'text',
        }),
    ],
})