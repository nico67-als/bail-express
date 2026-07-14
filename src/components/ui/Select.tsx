'use client'

import { useId, type SelectHTMLAttributes } from 'react'
import { Field, controlClasses } from './Field'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'children'> {
  label: string
  options: SelectOption[]
  error?: string
  hint?: string
  placeholder?: string
}

export default function Select({
  label,
  options,
  error,
  hint,
  required,
  placeholder = 'Sélectionner…',
  className = '',
  ...props
}: SelectProps) {
  const id = useId()

  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <select
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClasses(error)} ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}
