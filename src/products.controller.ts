import { ProductsDB } from "./products.model"
import { type ProductDBType } from "./types/product.type"




const productsDB = ProductsDB.instance()

export function getProductsHandler() {

  return productsDB.getProducts()


}

export function createProductHandler(product: ProductDBType) {
  console.log('handler', product)
  return productsDB.createProduct(product)
}