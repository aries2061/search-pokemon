'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

export default function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fill,
  priority,
  fallbackSrc = '/icon.svg',
  loading = 'lazy',
  sizes,
  fetchPriority
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Update imgSrc when src prop changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      fill={fill}
      priority={priority}
      loading={priority ? 'eager' : loading}
      sizes={sizes}
      fetchPriority={fetchPriority}
      onError={handleError}
    />
  );
}