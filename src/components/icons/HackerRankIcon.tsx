import type { SVGProps } from 'react';

export function HackerRankIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L3.5 6.5V17.5L12 22L20.5 17.5V6.5L12 2Z" />
      <path d="M9.5 8.5V15.5" />
      <path d="M14.5 8.5V15.5" />
      <path d="M9.5 12H14.5" />
    </svg>
  );
}
