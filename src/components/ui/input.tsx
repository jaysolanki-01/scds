import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-[11.5px] font-semibold uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7280" }}>{leftIcon}</div>
          )}
          <input
            id={inputId}
            className={cn(
              "w-full h-9 rounded-lg px-3 py-2 text-[13.5px] transition-colors focus:outline-none",
              error && "focus:ring-red-400",
              leftIcon && "pl-9",
              className
            )}
            style={{
              border: "1px solid #333333",
              background: "#252525",
              color: "#F5F5F5",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "#DC2626"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.12)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "#333333"; e.currentTarget.style.boxShadow = "none"; }}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-[12px] text-red-500">{error}</p>}
        {hint && !error && <p className="text-[12px]" style={{ color: "#6B7280" }}>{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
