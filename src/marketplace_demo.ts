import { notifyHandoff } from "./marketplace.js";

const buyerPhone = process.env.DEMO_BUYER_PHONE;
if (!buyerPhone) throw new Error("DEMO_BUYER_PHONE is required");
const result = await notifyHandoff({ orderId: "ord-204", sellerId: "seller-7", assetName: "camera kit", buyerPhone, update: "seller_ready" });
console.log(JSON.stringify(result, null, 2));
