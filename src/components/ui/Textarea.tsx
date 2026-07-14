'use client'

import { useId, type TextareaHTMLAttributes } from 'react'
import { Field, controlClasses } from './Field'

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string
  error?: string
  hint?: string
}

export default function Textarea({
  label,
  error,
  hint,
  required,
  rows = 3,
  className = '',
  ...props
}: TextareaProps) {
  const id = useId()

  return (
    <Field id={id} label={label} error={error} hint={hint} required={required}>
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${controlClasses(error)} resize-y ${className}`}
        {...props}
      />
    </Field>
  )
}
