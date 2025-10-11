'use client';

import React from 'react';
import Image from 'next/image';
import { 
  CardProps, 
  CardImageProps, 
  CardContentProps, 
  CardTitleProps, 
  CardTypeProps 
} from '../../lib/interfaces/ui';

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div 
      className={`pokemon-card ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardImage({ src, alt, className = '' }: CardImageProps) {
  return (
    <div className={`pokemon-card-image-container ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-contain"
      />
    </div>
  );
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <div className={`pokemon-card-content ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`pokemon-card-title ${className}`}>
      {children}
    </h3>
  );
}

export function CardType({ type, className = '' }: CardTypeProps) {
  return (
    <span className={`pokemon-card-type ${className}`}>
      {type}
    </span>
  );
}