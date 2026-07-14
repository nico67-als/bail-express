'use client'

import type { EtapeNum } from '@/types'
import type { EtapeDef } from '@/lib/etapes'

export interface StepperProps {
  etapes: EtapeDef[]
  courante: EtapeNum
  /** Permet de revenir en arrière en cliquant sur une étape déjà franchie. */
  onNaviguer?: (etape: EtapeNum) => void
}

export default function Stepper({ etapes, courante, onNaviguer }: StepperProps) {
  const indexCourant = etapes.findIndex((etape) => etape.numero === courante)
  const progression =
    etapes.length > 1 ? (indexCourant / (etapes.length - 1)) * 100 : 100

  return (
    <nav aria-label="Progression du questionnaire">
      {/* Compact sur mobile : la liste complète des étapes n'y tiendrait pas. */}
      <div className="sm:hidden">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-gray-900">
            {etapes[indexCourant]?.titre}
          </span>
          <span className="text-xs text-gray-500">
            Étape {indexCourant + 1} sur {etapes.length}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300"
            style={{ width: `${Math.max(progression, 4)}%` }}
          />
        </div>
      </div>

      <ol className="hidden items-center gap-2 sm:flex">
        {etapes.map((etape, index) => {
          const franchie = index < indexCourant
          const active = index === indexCourant
          const cliquable = franchie && onNaviguer

          return (
            <li key={etape.numero} className="flex flex-1 items-center gap-2">
              <button
                type="button"
                disabled={!cliquable}
                onClick={() => onNaviguer?.(etape.numero)}
                aria-current={active ? 'step' : undefined}
                className={`flex items-center gap-2 rounded-lg px-1 py-1 text-left transition-colors ${
                  cliquable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-indigo-600 text-white'
                      : franchie
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {franchie ? '✓' : index + 1}
                </span>
                <span
                  className={`hidden text-xs font-medium lg:block ${
                    active
                      ? 'text-indigo-700'
                      : franchie
                        ? 'text-gray-700'
                        : 'text-gray-400'
                  }`}
                >
                  {etape.courte}
                </span>
              </button>

              {index < etapes.length - 1 && (
                <span
                  className={`h-px flex-1 ${franchie ? 'bg-indigo-200' : 'bg-gray-200'}`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
