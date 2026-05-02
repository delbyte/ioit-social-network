"use client";

import type { SVGProps } from "react";

export function MingleMark({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className={className}
      fill="none"
      {...props}
    >
      <defs>
        <linearGradient id="mingle-mark-gradient" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f97316" />
          <stop offset="0.48" stopColor="#06b6d4" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <path
        d="M25.4 5.8c9.5 0 16.8 6.7 16.8 15.6 0 9.1-7.7 16-18.2 16h-2.7l-8.8 5.2c-1.5.9-3.3-.6-2.7-2.3l2.5-7.1C8.4 30.3 5.8 26 5.8 21.4 5.8 12.5 13.7 5.8 25.4 5.8Z"
        fill="url(#mingle-mark-gradient)"
      />
      <path
        d="M16 27.5c3.8-7.4 7.3-11.1 10.6-11.1 3.1 0 4.7 2 4.7 4.3 0 2.7-2.2 4.6-5 4.6h-3.2c-2.5 0-4.1 1.1-5.1 3.2"
        stroke="white"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MingleLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <MingleMark className="size-9 shrink-0 drop-shadow-sm" />
      <span className="text-xl font-black tracking-normal text-foreground">mingle</span>
    </span>
  );
}
