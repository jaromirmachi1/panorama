import type { SVGProps } from "react";

/** Minimal line icons — match site gold / ink palette via `color` on wrapper */

export function IconKitchen(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 28h40v20a4 4 0 0 1-4 4H16a4 4 0 0 1-4-4V28Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M20 20h24v8H20v-8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 36h16M28 40h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="44" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M44 17v6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconElectrical(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M30 12 18 36h10l-4 20 16-28H30l6-16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <rect
        x="40"
        y="38"
        width="14"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M44 44h6M44 48h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconBath(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M14 36c2 8 8 14 18 14s16-6 18-14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M18 32h28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M26 24v8M32 20v12M38 24v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <rect
        x="22"
        y="12"
        width="20"
        height="8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function IconDoor(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
    >
      <rect
        x="14"
        y="10"
        width="28"
        height="44"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14 22h28"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.35"
      />
      <circle cx="36" cy="34" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M42 18h10v36a2 2 0 0 1-2 2H42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
