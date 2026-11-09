import React from 'react';
import {
  categoryColors,
  categoryIcons,
  type CategoryType,
} from '@/constants/categories.constants';

interface CategoryIconProps {
  category: CategoryType | string;
  size?: number;
}

export function CategoryIcon({ category, size = 17 }: CategoryIconProps) {
  const Icon =
    categoryIcons[category as CategoryType] ?? categoryIcons.Other;

  const color = categoryColors[category as CategoryType] ?? 'slate';

  return (
    <span className={`category-icon ${color}`}>
      <Icon size={size} strokeWidth={1.9} />
    </span>
  );
}

export default CategoryIcon;
