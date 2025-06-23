'use client';

import React from 'react';

// Form section component
interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <div className="pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold leading-7 text-gray-900">{title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
        {children}
      </div>
    </div>
  );
};

// Form field component
interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  className?: string;
  required?: boolean;
  rows?: number;
  defaultValue?: string | number;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  className = 'sm:col-span-3',
  required = false,
  rows,
  defaultValue = '',
  error
}) => {
  const Component = rows ? 'textarea' : 'input';
  
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="mt-2">
        <Component
          id={id}
          name={id}
          type={rows ? undefined : type}
          rows={rows}
          required={required}
          defaultValue={defaultValue}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};