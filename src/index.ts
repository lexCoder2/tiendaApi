// Import the framework and instantiate it
import Fastify from "fastify";
import {
  createProductHandler,
  getProductHandler,
  getProductsHandler,
} from "./products.controller";
import { type ProductDBType } from "./types/product.type";
import fastifyCors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});
fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    const hostname = new URL(origin ?? "*").hostname;
    if (hostname === "localhost") {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  },
});
fastify.get("/products", async function handler(request, reply) {
  const products = await getProductsHandler();
  reply.send(products);
});

fastify.get<{ Params: { id: number } }>(
  "/products/:id",
  async function handler(request, reply) {
    const products = await getProductHandler(request.params.id);
    reply.send(products);
  },
);
fastify.post(
  "/products",
  { schema: { body: { type: "object" } } },
  async (req, rep) => {
    const data = await createProductHandler(req.body as ProductDBType);
    rep.send(data);
  },
);

try {
  fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
