import React, { useState } from 'react';
import { 
  Mail, 
  Calendar, 
  Flame, 
  Dumbbell, 
  Scale, 
  Ruler, 
  Edit3, 
  Check 
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Avatar from '../components/common/Avatar';
import { initialUserData } from '../data/user';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Profile() {
  const [userData, setUserData] = useLocalStorage('fitforge_user', initialUserData);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: userData.name,
    age: userData.age,
    height: userData.height,
    weight: userData.weight,
    activityLevel: userData.activityLevel,
    experienceLevel: userData.experienceLevel
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserData((prev) => ({
      ...prev,
      ...formData,
      metrics: {
        ...prev.metrics,
        currentWeight: Number(formData.weight) || prev.metrics.currentWeight
      }
    }));
    setEditModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CCFF00]/10 text-[#CCFF00] border border-[#CCFF00]/25 mb-2.5">
            Athlete Identity
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            User Profile
          </h1>
        </div>

        <Button
          variant="secondary"
          onClick={() => {
            setFormData({
              name: userData.name,
              age: userData.age,
              height: userData.height,
              weight: userData.weight,
              activityLevel: userData.activityLevel,
              experienceLevel: userData.experienceLevel
            });
            setEditModalOpen(true);
          }}
          className="gap-2"
        >
          <Edit3 size={16} />
          <span>Edit Profile</span>
        </Button>
      </div>

      {/* Main Profile Identity Card */}
      <Card glow="lime" className="p-8 sm:p-10 mb-8">
        <div className="flex items-center gap-6 sm:gap-8 flex-wrap mb-8 pb-8 border-b border-white/10">
          {/* Initials Avatar */}
          <div className="relative">
            <Avatar name={userData.name} size="xl" />
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-gray-950 border-2 border-[#0E131E]">
              <Check size={14} strokeWidth={3} />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {userData.name}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30">
                {userData.experienceLevel}
              </span>
            </div>

            <p className="text-sm text-gray-400 flex items-center gap-2 mb-1">
              <Mail size={14} /> <span>{userData.email}</span>
            </p>

            <p className="text-xs text-gray-500">
              Member since {userData.joinedDate}
            </p>
          </div>
        </div>

        {/* Biometrics Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Body Weight
            </span>
            <div className="flex items-center gap-2">
              <Scale size={18} className="text-[#00E5FF] shrink-0" />
              <span className="font-bold text-white text-sm sm:text-base">
                {userData.weight} kg
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Height
            </span>
            <div className="flex items-center gap-2">
              <Ruler size={18} className="text-[#FF6B4A] shrink-0" />
              <span className="font-bold text-white text-sm sm:text-base">
                {userData.height}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Age
            </span>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-purple-400 shrink-0" />
              <span className="font-bold text-white text-sm sm:text-base">
                {userData.age} years old
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Activity Level
            </span>
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-[#CCFF00] shrink-0" />
              <span className="font-bold text-white text-sm sm:text-base">
                {userData.activityLevel}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">
              Experience Level
            </span>
            <div className="flex items-center gap-2">
              <Dumbbell size={18} className="text-[#00E5FF] shrink-0" />
              <span className="font-bold text-white text-sm sm:text-base">
                {userData.experienceLevel}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Athlete Profile"
      >
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10 mb-1">
            <Avatar name={formData.name} size="lg" />
            <div>
              <span className="text-xs font-bold text-white block">Initials Avatar Preview</span>
              <span className="text-[11px] text-gray-400">Updates automatically as you type your name.</span>
            </div>
          </div>

          <Input
            label="Full Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Age"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              required
            />

            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              required
            />
          </div>

          <Input
            label="Height"
            type="text"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            required
          />


          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300">Activity Level</label>
            <select
              className="rounded-xl border border-white/10 bg-[#090C12] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#CCFF00]"
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
            >
              <option value="Sedentary (Little/no exercise)">Sedentary (Little/no exercise)</option>
              <option value="Moderate (2-3 days/week)">Moderate (2-3 days/week)</option>
              <option value="Very Active (4-5 days/week)">Very Active (4-5 days/week)</option>
              <option value="Elite (6+ days/week)">Elite (6+ days/week)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300">Experience Level</label>
            <select
              className="rounded-xl border border-white/10 bg-[#090C12] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#CCFF00]"
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            >
              <option value="Beginner (< 1 year)">Beginner (&lt; 1 year)</option>
              <option value="Intermediate (1-3 years)">Intermediate (1-3 years)</option>
              <option value="Advanced (3+ years)">Advanced (3+ years)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
