"use client"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"

export interface ProductImage {
  type: "image" | "video";
  url: string;
  alt?: string;
}
interface ColorOption {
  id: string
  name: string
  value: string
  code: string
  available: boolean
}

interface SizeOption {
  id: string
  name: string
  value: string
  available: boolean
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  discount: number
  installments: number
  category: string
  rating: number
  reviewCount: number
  images: ProductImage[]
  colors: ColorOption[]
  sizes: SizeOption[]
}

interface ProductState {
  product: Product | null
  loading: boolean
  error: string | null
  selectedImage: ProductImage | null
  selectedColor: string | null
  selectedSize: string | null
  quantity: number
}

type ProductAction =
  | { type: "SET_PRODUCT"; payload: Product }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SELECTED_IMAGE"; payload: ProductImage | null }
  | { type: "SET_SELECTED_COLOR"; payload: string | null }
  | { type: "SET_SELECTED_SIZE"; payload: string | null }
  | { type: "SET_QUANTITY"; payload: number }

const initialState: ProductState = {
  product: null,
  loading: true,
  error: null,
  selectedImage: null,
  selectedColor: null,
  selectedSize: null,
  quantity: 1,
}

const productReducer = (state: ProductState, action: ProductAction): ProductState => {
  switch (action.type) {
    case "SET_PRODUCT":
      return {
        ...state,
        product: action.payload,
        loading: false,
        error: null,
      }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }
    case "SET_SELECTED_IMAGE":
      return {
        ...state,
        selectedImage: action.payload,
      }
    case "SET_SELECTED_COLOR":
      return {
        ...state,
        selectedColor: action.payload,
      }
    case "SET_SELECTED_SIZE":
      return {
        ...state,
        selectedSize: action.payload,
      }
    case "SET_QUANTITY":
      return {
        ...state,
        quantity: action.payload,
      }
    default:
      return state
  }
}

const ProductContext = createContext<{
  state: ProductState
  dispatch: React.Dispatch<ProductAction>
}>({
  state: initialState,
  dispatch: () => null,
})

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(productReducer, initialState)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }
        const productData = await response.json()
        dispatch({ type: "SET_PRODUCT", payload: productData })

        // Initialize selected image from localStorage or first image
        const savedImage = localStorage.getItem("selectedImage")
        if (savedImage) {
          try {
            const parsedImage: ProductImage = JSON.parse(savedImage)
            if (parsedImage && parsedImage.url) {
              dispatch({ type: "SET_SELECTED_IMAGE", payload: parsedImage })
            }
          } catch (error) {
            console.error("Error parsing saved image:", error)
          }
        } else if (productData.images && productData.images.length > 0) {
          dispatch({ type: "SET_SELECTED_IMAGE", payload: productData.images[0] })
        }

        // Initialize selected color from localStorage
        const savedColor = localStorage.getItem("selectedColor")
        if (savedColor && productData.colors.some((c: ColorOption) => c.value === savedColor)) {
          dispatch({ type: "SET_SELECTED_COLOR", payload: savedColor })
        }

        // Initialize selected size from localStorage
        const savedSize = localStorage.getItem("savedSize") // corrected from "selectedSize"
        if (savedSize && productData.sizes.some((s: SizeOption) => s.value === savedSize)) {
          dispatch({ type: "SET_SELECTED_SIZE", payload: savedSize })
        }

      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error instanceof Error ? error.message : 'Failed to load product' })
      }
    }

    fetchProduct()
  }, [])

  return <ProductContext.Provider value={{ state, dispatch }}>{children}</ProductContext.Provider>
}

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider")
  }
  return context
}