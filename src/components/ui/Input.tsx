'use client'

import { useId, type InputHTMLAttributes } from 'react'
import { Field, controlClasses } from './Field'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string
  error?: string
  hint?: string
}

export default function Input({
  label,
  error,
  hint,
  required,
  className = '',
  ...props
}: InputProps) {
  const id = useId()

  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <input
        id={id}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClasses(error)} ${className}`}
        {...props}
      />
    </Field>
  )
}
