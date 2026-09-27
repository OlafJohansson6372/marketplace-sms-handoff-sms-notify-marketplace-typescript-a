import test from "node:test";
import assert from "node:assert/strict";
import { handoffMessage, handoffSchema } from "../src/marketplace.js";

test("seller-ready handoff names the order, asset, and seller", () => {
  const input = handoffSchema.parse({ orderId: "ord-204", sellerId: "seller-7", assetName: "camera kit", buyerPhone: "+14155550123", update: "seller_ready" });
  assert.equal(handoffMessage(input), "Order ord-204: camera kit is ready for handoff from seller seller-7.");
});

test("request boundary rejects a phone without international form", () => {
  assert.throws(() => handoffSchema.parse({ orderId: "ord-204", sellerId: "seller-7", assetName: "camera kit", buyerPhone: "4155550123", update: "seller_ready" }));
});
