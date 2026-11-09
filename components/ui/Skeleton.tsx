import React from 'react';

export function Skeleton({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-[#e2e8f0]/80 dark:bg-zinc-800 ${className}`}
      {...props}
    />
  );
}

export default Skeleton;
