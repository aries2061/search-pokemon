'use client';

import React from 'react';
import { ButtonProps } from '../../lib/interfaces/ui';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon,
  type = 'button',
  disabled = false,
  ariaLabel,
}: ButtonProps) {
  const baseClass = 'btn';
  const variantClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const iconClass = icon ? 'btn-icon' : '';
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${iconClass} ${className}`}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}