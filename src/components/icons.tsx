import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c-2 0-4-1-4-4 0-2 2-4 4-4s4 2 4 4c0 3-2 4-4 4z" />
      <path d="M12 14v- लाइट" />
      <path d="M16 8.9A4.3 4.3 0 0 0 12 6c-2.4 0-4.4 1.8-4.4 4.2" />
      <path d="M8.2 9.5A2.5 2.5 0 0 1 12 6" />
      <path d="M12 2a4.4 4.4 0 0 1 4 4.4" />
      <path d="M15.8 9.5a2.5 2.5 0 0 0-4.2-3.3" />
    </svg>
  );
}
