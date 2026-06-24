import React from 'react';

const Input = React.forwardRef(({ 
  className = '', 
  label, 
  error, 
  id, 
  icon: Icon,
  ...props 
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1 text-xs font-semibold text-on-surface uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-outline-variant" />
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`flex h-10 w-full rounded border bg-surface-container-lowest py-2 text-sm text-on-surface transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${
            Icon ? 'pl-10 pr-3' : 'px-3'
          } ${
            error ? 'border-error focus:ring-error focus:border-error' : 'border-outline-variant'
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span className="mt-1 flex items-center text-xs text-error font-medium">
          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;