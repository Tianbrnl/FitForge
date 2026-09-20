# FitForge

FitForge is a modern AI-powered fitness web application designed to help users manage workouts, nutrition, fitness goals, and progress in one place.

The application combines a React frontend with Supabase for authentication and user data, Sanity for workout/exercise content management, and Gemini AI for fitness-focused assistance.

## Features

* 🔐 User authentication with Supabase
* 🏋️ Workout and exercise library
* 🤖 AI fitness assistant powered by Gemini
* 🍎 Nutrition and macronutrient tracking
* 📊 Fitness progress tracking
* 👤 User profile management
* 🎯 Fitness goals and targets
* 📝 Custom workout management
* 🧠 Sanity-powered exercise content management
* 📱 Responsive modern interface
* ☁️ Vercel deployment

## Tech Stack

### Frontend

* React
* Vite
* JavaScript / JSX
* Tailwind CSS
* Lucide React
* React Router

### Backend & Services

* Supabase

  * Authentication
  * PostgreSQL database
  * User profiles
  * AI usage tracking
* Sanity

  * Exercise content management
  * Sanity Studio
* Google Gemini

  * AI fitness assistant
* Vercel

  * Frontend hosting
  * Serverless API functions

## Project Structure

```text
FitForge/
├── api/
│   └── chat.js
│
├── public/
│
├── sanity/
│   ├── schemaTypes/
│   │   ├── exercise.js
│   │   └── index.js
│   └── sanity.config.js
│
├── server/
│   ├── .env
│   ├── gemini.js
│   ├── index.js
│   └── sanity.js
│
├── src/
│   ├── components/
│   │   ├── ai/
│   │   └── ...
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── ...
│   └── main.jsx
│
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## Requirements

Before running FitForge locally, make sure you have:

* Node.js
* npm
* A Supabase project
* A Sanity project
* A Google Gemini API key

## Installation

Clone the repository:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd FitForge
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the project root.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

For the server-side AI functionality, configure the following environment variables in your deployment platform:

```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Security

Never commit API keys, Supabase service-role keys, or other private credentials to GitHub.

The Supabase service-role key and Gemini API key must remain server-side.

The `.gitignore` file should include:

```gitignore
.env
.env.local
.env.*.local
```

## Running the Frontend

Start the Vite development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## AI Assistant

FitForge includes an AI fitness assistant that can help users with topics such as:

* Exercise
* Workout routines
* Strength training
* Cardio
* Muscle groups
* Workout programming
* Nutrition
* Calories
* Macronutrients
* Weight management
* Recovery
* Fitness goals

The frontend sends authenticated requests to:

```text
/api/chat
```

The API endpoint validates the user's Supabase authentication token before processing the request.

AI usage is also tracked through the `ai_usage` table, with a daily usage limit implemented on the server.

## Sanity CMS

Sanity is used to manage the exercise library.

The Sanity project uses:

```text
Project ID: m1jtz9wr
Dataset: production
```

The Sanity Studio contains an `Exercise` content type where administrators can create and publish exercises.

After an exercise is published in Sanity, the FitForge application can retrieve the content through the Sanity API.

### Sanity Studio

The Sanity Studio is deployed separately from the main FitForge website.

Administrators can use the deployed Studio to:

* Add exercises
* Edit exercises
* Publish exercises
* Manage exercise information

Adding or editing exercises in Sanity does not require rebuilding the React application.

## Supabase

Supabase is used for application authentication and user-related data.

Main responsibilities include:

* User authentication
* User profiles
* Fitness-related user data
* AI usage tracking
* Database storage

The frontend uses the Supabase publishable key.

Server-side operations use the Supabase service-role key through protected server environment variables.

## API Architecture

The AI request flow works approximately like this:

```text
User
  │
  ▼
FitForge React App
  │
  │ POST /api/chat
  ▼
Vercel Serverless Function
  │
  ├── Validate Supabase access token
  │
  ├── Check daily AI usage
  │
  ├── Get user profile
  │
  ├── Send request to Gemini
  │
  └── Record AI usage
  │
  ▼
Gemini AI
  │
  ▼
AI Response
  │
  ▼
FitForge Chat Interface
```

## Sanity Exercise Flow

```text
Sanity Studio
      │
      │ Publish Exercise
      ▼
Sanity Dataset
      │
      ▼
FitForge Sanity Client
      │
      ▼
Exercise Service
      │
      ▼
Workout / Exercise Interface
```

## Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Deployment

FitForge is deployed using Vercel.

The deployment includes:

* React/Vite frontend
* Vercel Serverless API
* Environment variables
* `/api/chat` AI endpoint

After pushing changes to the configured Git branch, Vercel can automatically build and deploy the project.

### Production Environment Variables

Configure the following variables in Vercel:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
GEMINI_API_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Keep private credentials restricted to server-side environments.

## Git Workflow

Feature development should be done on separate branches instead of directly on `main`.

Example:

```bash
git switch -c feat/new-feature
```

After making changes:

```bash
git status
git add .
git commit -m "Add new feature"
git push -u origin feat/new-feature
```

After testing the feature, it can be merged into the main branch.

## Development Guidelines

When adding new features:

1. Create a feature branch.
2. Implement the feature.
3. Test locally.
4. Run the production build.

```bash
npm run build
```

5. Commit the changes.
6. Push the feature branch.
7. Test the Vercel deployment.
8. Merge into `main` when ready.

## Security Considerations

FitForge uses several security measures:

* Supabase authentication for user access
* Server-side validation of authentication tokens
* Server-side Gemini API requests
* Server-side Supabase service-role credentials
* Environment variables for sensitive configuration
* Daily AI usage limits
* Sanity CORS configuration for the deployed frontend

Private credentials should never be placed inside frontend source code or committed to GitHub.

## Project Status

FitForge is currently under active development.

Current major systems include:

* Authentication
* User profiles
* Workout system
* Exercise library
* Nutrition system
* Progress tracking
* Sanity CMS
* AI fitness assistant
* Supabase integration
* Vercel deployment


