"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[13px] font-semibold transition-all duration-150 cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
  {
    variants: {
      variant: {
        primary:
          "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-sm focus-visible:ring-[#DC2626]",
        secondary:
          "bg-[#252525] border border-[#333333] text-[#E5E7EB] hover:bg-[#2E2E2E] shadow-sm focus-visible:ring-[#DC2626]",
        outline:
          "border border-[#333333] bg-[#252525] text-[#E5E7EB] hover:bg-[#2E2E2E] focus-visible:ring-[#DC2626]",
        ghost:
          "text-[#9CA3AF] hover:text-[#F5F5F5] hover:bg-[#1F1F1F] focus-visible:ring-[#DC2626]",
        danger:
          "bg-red-600 text-white hover:bg-red-700 shadow-sm focus-visible:ring-red-500",
        "danger-outline":
          "border border-red-200 text-red-600 hover:bg-red-50 focus-visible:ring-red-500",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-10 px-5",
        icon: "h-9 w-9",
        "icon-sm": "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
