
"use client"

import { useState, useCallback } from "react"
import VariantSelector from "./VariantSelector"
import ShippingCalculator from "./ShippingCalculator"
import { useProductContext } from "../store/ProductContext"
import { ShoppingCart } from "lucide-react"
import { toast } from 'sonner'; 



export default function ProductInfo() {
  const { state, dispatch } = useProductContext()
  // Adicionei 'loading' aqui, assumindo que você adicionou ao ProductState no contexto
  const { product, selectedSize, selectedColor, quantity, loading } = state
  const [addedToCart, setAddedToCart] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      // Substituído alert por toast
      toast("Por favor, selecione tamanho e cor antes de adicionar ao carrinho", {
     
        className: 'my-toast-class', 
        duration: 3000, // Duração em ms (padrão 4000)
        position: 'bottom-right', // Posição
        style: { background: 'orange' }, 
      });
      return
    }

    // Simulação de adição ao carrinho
    setAddedToCart(true)
    
   toast.success("Produto adicionado ao carrinho!", {
        className: 'sonner-success-toast', // Classe para o toast de sucesso
    });
    setTimeout(() => setAddedToCart(false), 2000)

    console.log("Produto adicionado:", {
      product: product?.name,
      size: selectedSize,
      color: selectedColor,
      quantity,
    })
     // Lógica real de adição ao carrinho viria aqui
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      dispatch({ type: "SET_QUANTITY", payload: newQuantity })
    }
  }

  const handleSelectColor = useCallback(
    (color: string) => {
      dispatch({ type: "SET_SELECTED_COLOR", payload: color })
    },
    [dispatch]
  )

  const handleSelectSize = useCallback(
    (size: string) => {
      dispatch({ type: "SET_SELECTED_SIZE", payload: size })
    },
    [dispatch]
  )

  // Estado de carregamento (baseado na prop 'loading' do contexto)
  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
        <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
        <div className="space-y-4">
          <div className="h-4 w-1/4 bg-gray-200 rounded"></div>
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Estado de erro (se product for null após carregar e não estiver carregando)
  if (!product) {
    return <div className="text-red-500">Falha ao carregar produtos!</div> // Ou uma mensagem de erro mais detalhada
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm text-gray-500">
        Home / {product.category || 'Categoria'} / {product.name}
      </div>

      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex">
            {/* Adicionado verificação para product.rating */}
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${product.rating !== undefined && i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
           {/* Adicionado verificação para product.rating e product.reviewCount */}
          {product.rating !== undefined && product.reviewCount !== undefined && (
            <span className="text-gray-500">
              {product.rating.toFixed(1)} ({product.reviewCount} avaliações)
            </span>
          )}
        </div>
      </div>

      {/* Verificações adicionadas para garantir que as propriedades existam antes de usar toFixed */}
       {product.price !== undefined && product.originalPrice !== undefined && (
          <div className="flex items-baseline gap-4">
            {product.discount > 0 && (
              <span className="text-lg text-gray-500 line-through">R$ {product.originalPrice.toFixed(2)}</span>
            )}
            <span className="text-3xl font-bold text-emerald-600">R$ {product.price.toFixed(2)}</span>
            {product.discount > 0 && (
              <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-md">
                {product.discount}% OFF
              </span>
            )}
          </div>
       )}


      {/* Verificações adicionadas */}
      {product.price !== undefined && product.installments !== undefined && product.installments > 0 && (
        <div className="text-sm text-gray-600">
          <p>
            Em até {product.installments}x de R$ {(product.price / product.installments).toFixed(2)} sem juros
          </p>
          <p className="text-emerald-600 font-medium">R$ {(product.price * 0.9).toFixed(2)} à vista (10% de desconto)</p>
        </div>
      )}


      <div className="space-y-4">
         {/* Passando options e selected apenas se existirem */}
         {product.colors && product.colors.length > 0 && (
            <VariantSelector
              type="color"
              options={product.colors}
              selected={selectedColor}
              onSelect={handleSelectColor}
            />
         )}
         {product.sizes && product.sizes.length > 0 && (
            <VariantSelector
              type="size"
              options={product.sizes}
              selected={selectedSize}
              onSelect={handleSelectSize}
            />
         )}
      </div>

       {/* Adicionado verificação para quantity */}
       {quantity !== undefined && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button
                  onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
       )}


      <ShippingCalculator /> {/* Verifique se ShippingCalculator lida bem com product=null (não usa product diretamente) */}

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-md font-medium transition-all ${
            addedToCart ? "bg-green-600 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          <ShoppingCart size={20} />
          {addedToCart ? "Adicionado!" : "Adicionar ao carrinho"}
        </button>
        <button className="flex-1 py-3 px-6 border border-emerald-600 text-emerald-600 rounded-md font-medium hover:bg-emerald-50 transition-colors">
          Comprar agora
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600 space-y-2">
        <p className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Garantia de 30 dias
        </p>
        <p className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Troca grátis
        </p>
      </div>
    </div>
  )
}