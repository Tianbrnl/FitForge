import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  icon: Icon,
  rightElement,
  error,
  helperText,
  className = '',
  containerClassName = '',
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold text-gray-300"
        >
          {label}
          {required && <span className="text-[#CCFF00] ml-1">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3.5 text-gray-400 pointer-events-none shrink-0"
          />
        )}

        <input
          id={inputId}
          type={type}
          required={required}
          className={`
            w-full rounded-xl border bg-white/5 py-3 text-sm text-white placeholder-gray-500
            outline-none transition duration-150
            focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-10' : 'px-4'}
            ${rightElement ? 'pr-10' : 'pr-4'}
            ${error ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20' : 'border-white/10'}
            ${className}
          `}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3.5 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-0.5">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-xs text-gray-400 mt-0.5">{helperText}</p>
      )}
    </div>
  );
}
