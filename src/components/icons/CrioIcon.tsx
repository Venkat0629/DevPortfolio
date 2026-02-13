import type { SVGProps } from 'react';

export function CrioIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Beaver ears */}
      <ellipse cx="7" cy="5.5" rx="2.5" ry="2" />
      <ellipse cx="17" cy="5.5" rx="2.5" ry="2" />
      {/* Beaver head */}
      <ellipse cx="12" cy="10" rx="7" ry="6" />
      {/* Eyes */}
      <circle cx="9.5" cy="9" r="1" fill="white" />
      <circle cx="14.5" cy="9" r="1" fill="white" />
      <circle cx="9.5" cy="9" r="0.5" fill="currentColor" />
      <circle cx="14.5" cy="9" r="0.5" fill="currentColor" />
      {/* Nose */}
      <ellipse cx="12" cy="11.5" rx="1.2" ry="0.8" fill="white" />
      {/* Beaver teeth */}
      <rect x="10.8" y="12.3" width="1" height="1.5" rx="0.3" fill="white" />
      <rect x="12.2" y="12.3" width="1" height="1.5" rx="0.3" fill="white" />
      {/* Beaver tail */}
      <ellipse cx="12" cy="20" rx="3" ry="1.5" />
    </svg>
  );
}
