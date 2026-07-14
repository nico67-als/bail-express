'use client'

import { useId } from 'react'

export interface RadioOption<T extends string> {
  value: T
  label: string
  description?: string
}

export interface RadioGroupProps<T extends string> {
  label: string
  options: RadioOption<T>[]
  value: T | ''
  onChange: (value: T) => void
  error?: string
  hint?: string
  required?: boolean
  /** Cartes empilées (défaut) ou alignées en ligne sur écran large. */
  direction?: 'colonne' | 'ligne'
}

export default function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  hint,
  required,
  direction = 'colonne',
}: RadioGroupProps<T>) {
  const name = useId()

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </legend>

      <div
        className={
          direction === 'ligne'
            ? 'grid gap-3 sm:grid-cols-2'
            : 'flex flex-col gap-3'
        }
      >
        {options.map((option) => {
          const selectionne = value === option.value

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                selectionne
                  ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selectionne}
                onChange={() => onChange(option.value)}
                className="mt-0.5 h-5 w-5 shrink-0 border-gray-300 text-indigo-600 focus:ring-2 focus:ring-indigo-500/30"
              />
              <span className="text-sm">
                <span className="font-medium text-gray-900">{option.label}</span>
                {option.description && (
                  <span className="mt-0.5 block text-gray-500">{option.description}</span>
                )}
              </span>
            </label>
          )
        })}
      </div>

      {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </fieldset>
  )
}
