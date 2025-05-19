// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner' 

export const metadata: Metadata = {
  title: 'E-commerce',
  description: 'Created with commerce',
  generator: 'commerce',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-Br">
      <body>
        {children}
           <Toaster position="top-center" />
      </body>
    </html>
  )
}