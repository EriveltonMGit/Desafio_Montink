import { NextResponse } from 'next/server'
import db from '@/db.json'
export async function GET() {
  try {
    const product = db.products[0] 
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}