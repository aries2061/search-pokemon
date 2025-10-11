import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Pokemon } from '../types';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export interface CardTypeProps {
  type: string;
  className?: string;
}

export interface SearchInputProps {
  onSearch: (query: string) => void;
  initialValue?: string;
  placeholder?: string;
  className?: string;
}

export interface PokemonDetailsProps {
  pokemon: Pokemon;
  className?: string;
}