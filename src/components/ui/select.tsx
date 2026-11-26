"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Select({ value, onValueChange, placeholder, label, error, disabled, children, className }: SelectProps) {
  const id = label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#9CA3AF" }}>
          {label}
        </label>
      )}
      <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectPrimitive.Trigger
          id={id}
          className={cn(
            "flex h-9 w-full items-center justify-between rounded-md px-3 py-2 text-sm",
            "focus:outline-none focus:ring-1 focus:ring-brand-brown",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-red-400",
            className
          )}
          style={{ background: "#252525", border: "1px solid #333333", color: "#F5F5F5" }}
        >
          <SelectPrimitive.Value placeholder={<span className="text-brand-placeholder">{placeholder}</span>} />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 text-brand-muted" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="z-50 min-w-[8rem] overflow-hidden rounded-md shadow-dropdown animate-in fade-in-0 zoom-in-95"
            style={{ background: "#252525", border: "1px solid #333333" }}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.Viewport className="p-1 max-h-60 overflow-auto">
              {children}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <SelectPrimitive.Item
      value={value}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      )}
      style={{ color: "#F5F5F5" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#333333"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2">
        <Check className="h-3.5 w-3.5 text-brand-brown" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

export function SelectSeparator() {
  return <div className="my-1 h-px bg-brand-border" />;
}
