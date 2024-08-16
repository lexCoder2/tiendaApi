
export interface ProductDBType {
  id?: string,
  code: string,
  description: string,
  price: number,
  stock: number,
  sellPrice: number,
  cost: number,
  category: string,
  image?: string,
  active: boolean,
  createdAt: string,
  updatedAt: string
}