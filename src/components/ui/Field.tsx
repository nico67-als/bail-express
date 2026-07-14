import type { ReactNode } from 'react'

export interface FieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: ReactNode
}

/** Habillage commun des champs : label, aide, message d'erreur. */
export function Field({ id, label, error, hint, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

/** Styles communs aux contrôles saisissables (input, select, textarea). */
export function controlClasses(error?: string): string {
  const bordure = error
    ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500/20'

  return `w-full rounded-xl border bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-4 disabled:bg-gray-50 disabled:text-gray-500 ${bordure}`
}
