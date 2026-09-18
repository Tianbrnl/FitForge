import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Dumbbell, 
  Home, 
  LayoutDashboard, 
  Apple, 
  TrendingUp, 
  User, 
  Flame,
  LogIn,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    setIsLoggingOut(false);
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Workouts', path: '/workouts', icon: Dumbbell },
    { label: 'Nutrition', path: '/nutrition', icon: Apple },
    { label: 'Progress', path: '/progress', icon: TrendingUp },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Floating Pill Navigation */}
      <nav className="fixed top-5 inset-x-0 z-50 pointer-events-none hidden md:flex justify-center px-4" aria-label="Main Navigation">
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/12 bg-[#0A0E16]/85 backdrop-blur-2xl p-1.5 shadow-2xl hover:border-white/20 transition-all duration-300">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 px-3 py-1.5 text-white font-extrabold text-lg tracking-tight group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#CCFF00] to-[#00E5FF] flex items-center justify-center text-gray-950 shadow-[0_2px_8px_rgba(204,255,0,0.3)] group-hover:scale-105 transition duration-200">
              <Flame size={18} strokeWidth={2.8} />
            </div>
            <span>FitForge</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition duration-200
                    ${isActive
                      ? 'bg-[#CCFF00] text-gray-950 font-bold shadow-[0_0_15px_rgba(204,255,0,0.35)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Auth Action */}
          <div className="flex items-center pl-2 ml-1 border-l border-white/10 gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-white/5 transition duration-150 group"
                  title="View Profile"
                >
                  <Avatar
                    name={profile?.full_name || user.user_metadata?.full_name || user.email || 'Athlete'}
                    size="sm"
                    className="w-7 h-7 text-[11px]"
                  />
                  <span className="text-xs font-semibold text-gray-300 group-hover:text-white max-w-[100px] truncate hidden lg:inline-block">
                    {profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/25 text-xs font-semibold transition duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Sign out of your account"
                >
                  <LogOut size={13} />
                  <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition duration-200 active:scale-95"
              >
                <LogIn size={14} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header className="fixed top-0 inset-x-0 z-40 md:hidden flex items-center justify-between h-16 px-4 bg-[#0A0E16]/90 backdrop-blur-2xl border-b border-white/10">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#CCFF00] to-[#00E5FF] flex items-center justify-center text-gray-950 shadow-[0_2px_8px_rgba(204,255,0,0.3)]">
            <Flame size={16} strokeWidth={2.8} />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            FitForge
          </span>
        </Link>

        {/* Animated Hamburger / Close Button */}
        <button
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1.5 text-white transition duration-200 active:scale-95 cursor-pointer"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-current rounded-full transition-opacity duration-300 ease-in-out ${
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`w-5 h-0.5 bg-current rounded-full transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
        </button>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden bg-black/70 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed top-0 right-0 bottom-0 w-72 bg-[#0E131E] border-l border-white/15 p-6 flex flex-col gap-6 shadow-2xl transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#CCFF00] to-[#00E5FF] flex items-center justify-center text-gray-950">
                  <Flame size={16} strokeWidth={2.8} />
                </div>
                <span className="font-extrabold text-lg text-white tracking-tight">
                  FitForge
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-9 h-9 rounded-full bg-white/5 text-gray-400 hover:text-white flex items-center justify-center transition duration-150"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Links */}
            <div className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition duration-150
                      ${isActive
                        ? 'bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 font-bold'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }
                    `}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Drawer Footer Auth Section */}
            <div className="mt-auto pt-4 border-t border-white/10">
              {user ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition duration-150"
                  >
                    <Avatar
                      name={profile?.full_name || user.user_metadata?.full_name || user.email || 'Athlete'}
                      size="md"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-white truncate">
                        {profile?.full_name || user.user_metadata?.full_name || 'Athlete'}
                      </span>
                      <span className="text-xs text-gray-400 truncate">{user.email}</span>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    disabled={isLoggingOut}
                    className="w-full py-3 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 font-bold text-sm flex items-center justify-center gap-2 transition duration-150 cursor-pointer disabled:opacity-50"
                  >
                    <LogOut size={16} />
                    <span>{isLoggingOut ? 'Logging out...' : 'Log Out'}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#CCFF00] hover:bg-[#b5e600] text-gray-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(204,255,0,0.3)] transition duration-150 cursor-pointer"
                >
                  <LogIn size={16} />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
