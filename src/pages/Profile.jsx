import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Calendar,
  Flame,
  Dumbbell,
  Scale,
  Ruler,
  Edit3,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Avatar from '../components/common/Avatar';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

const ACTIVITY_OPTIONS = [
  'Sedentary (Little/no exercise)',
  'Moderate (2-3 days/week)',
  'Very Active (4-5 days/week)',
  'Elite (6+ days/week)'
];

const EXPERIENCE_OPTIONS = [
  'Beginner (< 1 year)',
  'Intermediate (1-3 years)',
  'Advanced (3+ years)'
];

export default function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: '',
    experienceLevel: '',
    joinedDate: ''
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: ACTIVITY_OPTIONS[0],
    experienceLevel: EXPERIENCE_OPTIONS[0]
  });

  const { user: authUser, loading: authLoading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    if (authLoading) return;

    if (!authUser) {
      navigate('/login');
      return;
    }

    const loadProfileData = async () => {
      setIsLoading(true);
      setErrorMsg('');

      try {
        // Query profiles table safely with maybeSingle() so missing rows don't cause an error
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (!isMounted) return;

        if (error && error.code !== 'PGRST116') {
          console.warn('Profile fetch note:', error.message);
        }

        // Construct athlete profile using profile table data with fallbacks to auth metadata & email
        const resolvedName =
          data?.full_name ||
          authUser.user_metadata?.full_name ||
          authUser.email?.split('@')[0] ||
          'Athlete';

        const profile = {
          name: resolvedName,
          email: authUser.email || '',
          age: data?.age ?? '',
          height: data?.height ?? '',
          weight: data?.weight ?? '',
          activityLevel: data?.activity_level || '',
          experienceLevel: data?.experience_level || '',
          joinedDate: authUser.created_at
            ? new Date(authUser.created_at).toLocaleDateString()
            : 'Recently'
        };

        setUserData(profile);
        setFormData({
          name: profile.name,
          age: profile.age,
          height: profile.height,
          weight: profile.weight,
          activityLevel: profile.activityLevel || ACTIVITY_OPTIONS[0],
          experienceLevel: profile.experienceLevel || EXPERIENCE_OPTIONS[0]
        });
      } catch (err) {
        console.error('Error fetching athlete profile:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProfileData();

    return () => {
      isMounted = false;
    };
  }, [authUser, authLoading, navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Height validation: must be a positive whole integer if provided
    if (formData.height !== '' && formData.height !== null && formData.height !== undefined) {
      const numHeight = Number(formData.height);
      if (isNaN(numHeight) || numHeight <= 0 || !Number.isInteger(numHeight) || numHeight > 300) {
        setErrorMsg('Please enter a valid height in cm (positive whole number between 1 and 300).');
        return;
      }
    }

    if (formData.age !== '' && formData.age !== null && formData.age !== undefined) {
      const numAge = Number(formData.age);
      if (isNaN(numAge) || numAge <= 0 || numAge > 130) {
        setErrorMsg('Please enter a valid age.');
        return;
      }
    }

    if (formData.weight !== '' && formData.weight !== null && formData.weight !== undefined) {
      const numWeight = Number(formData.weight);
      if (isNaN(numWeight) || numWeight <= 0 || numWeight > 500) {
        setErrorMsg('Please enter a valid weight in kg.');
        return;
      }
    }

    if (!authUser) {
      setErrorMsg('You are not logged in.');
      return;
    }

    setIsSaving(true);

    const resolvedActivity = formData.activityLevel || ACTIVITY_OPTIONS[0];
    const resolvedExperience = formData.experienceLevel || EXPERIENCE_OPTIONS[0];

    // Use upsert so that if the profile row doesn't exist yet, it is created
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: authUser.id,
        full_name: formData.name,
        age: formData.age !== '' && formData.age !== null ? Number(formData.age) : null,
        height: formData.height !== '' && formData.height !== null ? Number(formData.height) : null,
        weight: formData.weight !== '' && formData.weight !== null ? Number(formData.weight) : null,
        activity_level: resolvedActivity,
        experience_level: resolvedExperience
      })
      .select()
      .maybeSingle();

    if (error) {
      setErrorMsg(error.message);
      setIsSaving(false);
      return;
    }

    // Also update auth user metadata if name changed
    try {
      await supabase.auth.updateUser({
        data: { full_name: formData.name }
      });
      if (refreshProfile) {
        await refreshProfile();
      }
    } catch (metaErr) {
      console.warn('Could not update auth user metadata:', metaErr);
    }

    setUserData((prev) => ({
      ...prev,
      name: data?.full_name || formData.name,
      age: data?.age ?? (formData.age !== '' ? Number(formData.age) : ''),
      height: data?.height ?? (formData.height !== '' ? Number(formData.height) : ''),
      weight: data?.weight ?? (formData.weight !== '' ? Number(formData.weight) : ''),
      activityLevel: data?.activity_level || resolvedActivity,
      experienceLevel: data?.experience_level || resolvedExperience
    }));

    setIsSaving(false);
    setEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 size={36} className="text-[#CCFF00] animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading athlete profile...</p>
      </div>
    );
  }

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

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setErrorMsg('');
              setFormData({
                name: userData.name || '',
                age: userData.age ?? '',
                height: userData.height ?? '',
                weight: userData.weight ?? '',
                activityLevel: userData.activityLevel || ACTIVITY_OPTIONS[0],
                experienceLevel: userData.experienceLevel || EXPERIENCE_OPTIONS[0]
              });

              setEditModalOpen(true);
            }}
            className="gap-2"
          >
            <Edit3 size={16} />
            <span>Edit Profile</span>
          </Button>


        </div>
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
                {userData.name || 'Athlete'}
              </h2>
              {userData.experienceLevel && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30">
                  {userData.experienceLevel}
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400 flex items-center gap-2 mb-1">
              <Mail size={14} /> <span>{userData.email || 'No email'}</span>
            </p>

            <p className="text-xs text-gray-500">
              Member since {userData.joinedDate || 'Recently'}
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
                {userData.weight ? `${userData.weight} kg` : 'Not set'}
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
                {userData.height ? `${userData.height} cm` : 'Not set'}
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
                {userData.age ? `${userData.age} years old` : 'Not set'}
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
                {userData.activityLevel || 'Not set'}
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
                {userData.experienceLevel || 'Not set'}
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
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-xs mb-3">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

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
              min="1"
              max="130"
              value={formData.age}
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+$/.test(val)) {
                  setFormData({ ...formData, age: val });
                }
              }}
              required
            />

            <Input
              label="Weight (kg)"
              type="number"
              step="0.1"
              min="1"
              max="500"
              value={formData.weight}
              onKeyDown={(e) => {
                if (['e', 'E', '+', '-'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              required
            />
          </div>

          <Input
            label="Height (cm)"
            type="number"
            min="1"
            max="300"
            step="1"
            placeholder="e.g. 175"
            value={formData.height}
            onKeyDown={(e) => {
              // Block scientific notation ('e', 'E'), signs ('+', '-'), and decimals ('.')
              if (['e', 'E', '+', '-', '.'].includes(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              const val = e.target.value;
              // Allow empty or only positive whole numbers
              if (val === '' || /^\d+$/.test(val)) {
                setFormData({ ...formData, height: val });
              }
            }}
            helperText="Enter height in centimeters (positive whole numbers only)"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300">Activity Level</label>
            <select
              className="rounded-xl border border-white/10 bg-[#090C12] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#CCFF00]"
              value={formData.activityLevel}
              onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value })}
            >
              {ACTIVITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300">Experience Level</label>
            <select
              className="rounded-xl border border-white/10 bg-[#090C12] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#CCFF00]"
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
            >
              {EXPERIENCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
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
            <Button
              variant="primary"
              type="submit"
              loading={isSaving}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
