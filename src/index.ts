// Import the framework and instantiate it
import Fastify from "fastify";
import multipart from "@fastify/multipart";
import { networkInterfaces } from "node:os";
import querystring from "node:querystring";
import {
  createProductHandler,
  getProductHandler,
  getProductsHandler,
} from "./products.controller";
import { type ProductDBType } from "./types/product.type";
import fastifyCors from "@fastify/cors";
import { promisify } from "util";
import { pipeline } from "stream";
import { uploadImage } from "./uploadImage";
import { ipAddress } from "./utils";

const fastify = Fastify({
  logger: true,
  querystringParser: (str) => querystring.parse(str.toLowerCase()),
});
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
fastify.register(multipart);

fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // const hostname = new URL(origin ?? "*").hostname;
    // eslint-disable-next-line no-constant-condition
    if (true) {
      //  Request from localhost will pass
      cb(null, true);
      return;
    }
    // Generate an error on other origins, disabling access
    cb(new Error("Not allowed"), false);
  },
});

export interface queryParams {
  search: string;
}

fastify.get<{ Querystring: queryParams }>(
  "/products",
  async function handler(request, reply) {
    const queryParams = request.query;
    const products = await getProductsHandler(queryParams);
    reply.send(products);
  },
);

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

fastify.post("/image", function (req, reply) {
  console.log("..uploadding");
  const pump = promisify(pipeline);
  req.file({ limits: { fileSize: 8104857 } }).then((file) => {
    uploadImage(file, pump).then((response) => {
      reply.send({ response });
    });
  });
});

try {
  const ip = ipAddress();
  console.log(ip);
  fastify.listen({
    port: 3000,
    host: "172.31.60.115",
  });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
