import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import CreateWorkout from './pages/CreateWorkout';
import WorkoutDetails from './pages/WorkoutDetails';
import WorkoutSessionPage from './pages/WorkoutSessionPage';
import Nutrition from './pages/Nutrition';
import Progress from './pages/Progress';
import AITrainer from './pages/AITrainer';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application with Floating Pill Nav & Persistent AI Assistant */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workouts/create" element={<CreateWorkout />} />
          <Route path="/workouts/edit/:id" element={<CreateWorkout />} />
          <Route path="/workouts/:id" element={<WorkoutDetails />} />
          <Route path="/workouts/:id/session" element={<WorkoutSessionPage />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/ai-trainer" element={<AITrainer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

        {/* Auth Layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
