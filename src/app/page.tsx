"use client"
import ProductImages from "./components/ProductImages"
import ProductInfo from "./components/ProductInfo"
import { ProductProvider } from "./store/ProductContext"

export default function Home() {
  return (
    <ProductProvider>
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductImages />
          <ProductInfo />
        </div>
      </main>
    </ProductProvider>
  )
}
