import React from 'react';

const VARIANTS = {
  primary: 'bg-[#CCFF00] text-gray-950 font-bold hover:bg-[#b5e600] shadow-[0_4px_20px_rgba(204,255,0,0.25)] hover:shadow-[0_6px_25px_rgba(204,255,0,0.4)]',
  secondary: 'bg-white/10 text-white font-semibold hover:bg-white/15 border border-white/10 hover:border-white/20',
  outline: 'bg-transparent text-[#CCFF00] font-semibold border border-[#CCFF00]/40 hover:bg-[#CCFF00]/10 hover:border-[#CCFF00]',
  ghost: 'bg-transparent text-gray-400 font-semibold hover:text-white hover:bg-white/5',
  danger: 'bg-red-500/15 text-red-400 font-semibold border border-red-500/30 hover:bg-red-500/25'
};

const SIZES = {
  sm: 'px-3.5 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base'
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) {
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;
  const sizeClasses = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full transition duration-200
        active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
        cursor-pointer select-none whitespace-nowrap
        ${variantClasses}
        ${sizeClasses}
        ${className}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Processing...</span>
        </span>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 17} className="shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}
