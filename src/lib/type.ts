export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating_rate: number
  rating_count: number
  stock_status: string
}

export interface ProductFormData {
  title: string
  price: number
  description: string
  category: string
  stock_status: string
}