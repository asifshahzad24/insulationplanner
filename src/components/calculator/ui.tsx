"use client";

import { useId, type ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
  htmlFor,
  className = "",
}: {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] font-medium text-muted">
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-snug text-faint">{hint}</p> : null}
    </div>
  );
}

export function Question({ children }: { children: ReactNode }) {
  return <h3 className="mb-2.5 text-[15px] font-semibold text-ink">{children}</h3>;
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  size = "md",
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const name = useId();
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1 rounded-xl bg-canvas p-1">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <label
            key={o.value}
            className={`relative flex-1 cursor-pointer select-none whitespace-nowrap rounded-[9px] text-center font-medium transition ${
              size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-[13.5px]"
            } ${active ? "bg-surface text-ink shadow-[0_1px_3px_rgba(14,17,22,.14)]" : "text-muted hover:text-ink"}`}
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={active}
              onChange={() => onChange(o.value)}
              className="peer sr-only"
            />
            <span className="peer-focus-visible:underline">{o.label}</span>
          </label>
        );
      })}
    </div>
  );
}

const inputBase =
  "w-full rounded-[10px] border border-line-2 bg-surface px-3 py-2.5 text-[15px] text-ink tabular placeholder:text-faint focus:border-cold focus:outline-none focus:ring-2 focus:ring-cold/20";

export function NumInput({
  id,
  value,
  onChange,
  suffix,
  placeholder,
  ariaLabel,
  integer = false,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  placeholder?: string;
  ariaLabel?: string;
  integer?: boolean;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode={integer ? "numeric" : "decimal"}
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} ${suffix ? "pr-14" : ""}`}
      />
      {suffix ? (
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[13px] text-faint">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}

export function Select({
  id,
  value,
  onChange,
  options,
  ariaLabel,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; group?: string }[];
  ariaLabel?: string;
}) {
  const groups = Array.from(new Set(options.map((o) => o.group).filter(Boolean))) as string[];
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputBase} appearance-none pr-9`}
      >
        {groups.length
          ? groups.map((g) => (
              <optgroup key={g} label={g}>
                {options
                  .filter((o) => o.group === g)
                  .map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
              </optgroup>
            ))
          : options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint"
      >
        <path d="M5 7.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}
