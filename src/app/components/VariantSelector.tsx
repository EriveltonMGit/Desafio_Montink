// components/VariantSelector.tsx
"use client"

import { useEffect } from "react"
import { useProductContext } from "../store/ProductContext"

interface VariantOption {
  id: string
  name: string
  value: string
  available: boolean
  code?: string
}

interface VariantSelectorProps {
  type: "color" | "size"
  options: VariantOption[]
  selected: string | null
  onSelect: (value: string) => void
}

export default function VariantSelector({ type, options, selected, onSelect }: VariantSelectorProps) {
  const { dispatch } = useProductContext()

  useEffect(() => {
    const savedValue = localStorage.getItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`)
    if (savedValue && options.some(option => option.value === savedValue && option.available)) {
      onSelect(savedValue)
    }
  }, [type, onSelect, options])

  useEffect(() => {
    if (selected) {
      localStorage.setItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`, selected)
      const expirationTime = new Date().getTime() + 15 * 60 * 1000
      localStorage.setItem(`${type}ExpirationTime`, expirationTime.toString())
    }
  }, [selected, type])

  useEffect(() => {
    const checkExpiration = () => {
      const expirationTime = localStorage.getItem(`${type}ExpirationTime`)
      if (expirationTime && new Date().getTime() > Number.parseInt(expirationTime)) {
        localStorage.removeItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}`)
        localStorage.removeItem(`${type}ExpirationTime`)
        if (type === "color") {
          dispatch({ type: "SET_SELECTED_COLOR", payload: null })
        } else {
          dispatch({ type: "SET_SELECTED_SIZE", payload: null })
        }
      }
    }

    checkExpiration()
    const interval = setInterval(checkExpiration, 60000)

    return () => clearInterval(interval)
  }, [type, dispatch])

  const getLabel = () => {
    return type === "color" ? "Cor" : "Tamanho"
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{getLabel()}</label>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          if (type === "color") {
            return (
              <button
                key={option.id}
                onClick={() => option.available && onSelect(option.value)}
                className={`relative w-10 h-10 rounded-full ${
                  !option.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } ${selected === option.value ? "ring-2 ring-offset-2 ring-emerald-500" : ""}`}
                disabled={!option.available}
                title={option.available ? option.name : `${option.name} - Indisponível`}
              >
                <span className="absolute inset-0 rounded-full" style={{ backgroundColor: option.code }}></span>
              </button>
            )
          } else {
            return (
              <button
                key={option.id}
                onClick={() => option.available && onSelect(option.value)}
                className={`px-3 py-1 border rounded-md ${
                  !option.available
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : selected === option.value
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-300 hover:border-emerald-300"
                }`}
                disabled={!option.available}
              >
                {option.name}
              </button>
            )
          }
        })}
      </div>

      {selected && (
        <p className="mt-2 text-sm text-emerald-600">
          {type === "color"
            ? `Cor selecionada: ${options.find((o) => o.value === selected)?.name}`
            : `Tamanho selecionado: ${options.find((o) => o.value === selected)?.name}`}
        </p>
      )}
    </div>
  )
}