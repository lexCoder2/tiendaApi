import { Database as DB } from "sqlite3";
import { type ProductDBType } from "./types/product.type";
import { type queryParams } from ".";

export class ProductsDB {
  static instanceProducts: ProductsDB;
  db: DB;

  constructor(
    sql = new DB("products.db", (err) => {
      console.log(err ?? "connected");
    }),
  ) {
    this.db = sql;
  }

  static instance() {
    if (!this.instanceProducts) {
      this.instanceProducts = new ProductsDB();
    }
    return this.instanceProducts;
  }

  addProduct() {}

  getProducts(params: queryParams) {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM Productos";
      const sqlParams: string[] = [];
      if (params.search) {
        sqlParams.push(`%${params.search}%`);
        query += " WHERE description LIKE ?";
      }
      console.log(query, sqlParams);
      this.db.all(query, sqlParams, (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  getProduct(id) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM Productos WHERE id=?", [id], (err, rows) => {
        console.log(err, rows);
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  createProduct({
    code,
    description,
    stock,
    cost,
    sellPrice,
    price,
    category,
  }: ProductDBType) {
    return new Promise((resolve, reject) => {
      this.db.run(
        "INSERT INTO Productos(code, description, stock, cost, sellPrice, price, category, image, createdAt, updatedAt) values(?,?,?,?,?,?,?,?,?,?)",
        [
          code,
          description,
          stock,
          cost,
          sellPrice,
          price,
          category,
          "",
          Date.now(),
          Date.now(),
        ],
        handlePost(resolve, reject),
      );
    }).then((id) => this.getProduct(id));
  }
}
function handlePost(
  resolve: { (value: unknown): void; (arg0: any): void },
  reject: { (reason?: any): void; (arg0: any): void },
) {
  return function (err: any) {
    if (err) {
      reject(err);
    }
    resolve(this.lastID);
  };
}
