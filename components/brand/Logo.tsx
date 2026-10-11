// components/brand/Logo.tsx
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  variant?: "full" | "symbol" | "wordmark";
  theme?: "light" | "dark";
  className?: string;
}

export function Logo({
  variant = "full",
  theme = "light",
  className,
}: LogoProps) {
  const leafTop = theme === "dark" ? "#E7E2DA" : "#8CA68F";
  const leafBottom = theme === "dark" ? "#8CA68F" : "#4A7057";
  const textColor = theme === "dark" ? "#FFFFFF" : "#3C3C3C";

  const symbol = (
    <g>
      <path
        d="M90 20C75 -5 20 5 5 50C30 35 60 40 80 45C95 48 100 25 90 20Z"
        fill={leafTop}
      />
      <path
        d="M5 50C20 80 65 100 90 85C105 75 95 50 80 50C50 50 25 55 5 50Z"
        fill={leafBottom}
      />
    </g>
  );

  const wordmark = (
    <g
      stroke={textColor}
      strokeWidth="16"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      <path d="M45 26A22 22 0 1 0 45 74" />
      <path d="M78 26V52A22 22 0 0 0 122 52V26" />
      <path d="M148 26V74M148 48A20 20 0 0 1 180 34" />
      <circle cx="218" cy="50" r="22" />
    </g>
  );

  if (variant === "symbol") {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-8 w-8", className)}
        aria-label="Curo"
        role="img"
      >
        {symbol}
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <svg
        viewBox="0 0 250 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("h-8 w-auto", className)}
        aria-label="Curo"
        role="img"
      >
        {wordmark}
      </svg>
    );
  }

  // full = symbol + wordmark
  return (
    <svg
      viewBox="0 0 360 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-auto", className)}
      aria-label="Curo"
      role="img"
    >
      <g transform="translate(0 0) scale(0.95)">{symbol}</g>
      <g transform="translate(110 0)">{wordmark}</g>
    </svg>
  );
}
