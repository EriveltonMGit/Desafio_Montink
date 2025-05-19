import type React from "react"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Truck } from "lucide-react"
import { useProductContext } from "../store/ProductContext"

interface AddressData {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export default function ShippingCalculator() {
  const { dispatch } = useProductContext()
  const [cep, setCep] = useState("")
  const [formattedCep, setFormattedCep] = useState("")
  const [address, setAddress] = useState<AddressData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deliveryOptions, setDeliveryOptions] = useState<any[]>([])

  useEffect(() => {
    const savedCep = localStorage.getItem("shippingCep")
    const savedAddress = localStorage.getItem("shippingAddress")
    const savedDeliveryOptions = localStorage.getItem("deliveryOptions")

    if (savedCep) {
      setCep(savedCep)
      setFormattedCep(formatCep(savedCep))
    }

    if (savedAddress) {
      setAddress(JSON.parse(savedAddress))
    }

    if (savedDeliveryOptions) {
      setDeliveryOptions(JSON.parse(savedDeliveryOptions))
    }
  }, [])

  const formatCep = (value: string) => {
    const numericValue = value.replace(/\D/g, "")
    return numericValue.length <= 5 ? numericValue : `${numericValue.slice(0, 5)}-${numericValue.slice(5, 8)}`
  }

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "")
    setCep(rawValue)
    setFormattedCep(formatCep(rawValue))
  }

  const fetchAddress = async () => {
    if (cep.length !== 8) {
      setError("CEP deve conter 8 dígitos")
      toast.error("CEP deve conter 8 dígitos")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setError("CEP não encontrado")
        toast.error("CEP não encontrado")
        setAddress(null)
        setDeliveryOptions([])
      } else {
        setAddress(data)
        toast.success("CEP encontrado com sucesso!")
        const options = [
          { id: 1, name: "Entrega Padrão", price: 12.9, days: "3-5 dias úteis" },
          { id: 2, name: "Entrega Expressa", price: 24.9, days: "1-2 dias úteis" },
          { id: 3, name: "Retirada na Loja", price: 0, days: "Disponível em 24h" }
        ]

        setDeliveryOptions(options)

        localStorage.setItem("shippingCep", cep)
        localStorage.setItem("shippingAddress", JSON.stringify(data))
        localStorage.setItem("deliveryOptions", JSON.stringify(options))

        const expirationTime = new Date().getTime() + 15 * 60 * 1000
        localStorage.setItem("shippingExpirationTime", expirationTime.toString())
      }
    } catch (error) {
      setError("Erro ao buscar o CEP. Tente novamente.")
      toast.error("Erro ao buscar o CEP. Tente novamente.")
      console.error("Erro ao buscar CEP:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchAddress()
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium flex items-center gap-2 mb-3">
        <Truck size={18} className="text-emerald-600" />
        Calcular frete e prazo de entrega
      </h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={formattedCep}
            onChange={handleCepChange}
            placeholder="Digite seu CEP"
            maxLength={9}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={loading || cep.length !== 8}
          className={`px-4 py-2 rounded-md font-medium ${
            loading || cep.length !== 8
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          }`}
        >
          {loading ? "..." : "OK"}
        </button>
      </form>
    </div>
  )
}
