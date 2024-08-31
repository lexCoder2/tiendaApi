import { type queryParams } from ".";
import { ProductsDB } from "./products.model";
import { type ProductDBType } from "./types/product.type";

const productsDB = ProductsDB.instance();

export function getProductsHandler(searchParams: queryParams) {
  return productsDB.getProducts(searchParams);
}
export function getProductHandler(id: number) {
  return productsDB.getProduct(id);
}
export function createProductHandler(product: ProductDBType) {
  console.log("handler", product);
  return productsDB.createProduct(product);
}
