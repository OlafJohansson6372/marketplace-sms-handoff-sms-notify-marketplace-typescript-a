import { z } from "zod";
import { sendSms } from "./infrai.js";

export const handoffSchema = z.object({
  orderId: z.string().min(1),
  sellerId: z.string().min(1),
  assetName: z.string().min(1),
  buyerPhone: z.string().regex(/^\+[1-9]\d{7,14}$/),
  update: z.enum(["seller_ready", "buyer_picked_up"])
});
export type Handoff = z.infer<typeof handoffSchema>;

export function handoffMessage(input: Handoff): string {
  return input.update === "seller_ready"
    ? `Order ${input.orderId}: ${input.assetName} is ready for handoff from seller ${input.sellerId}.`
    : `Order ${input.orderId}: pickup confirmed for ${input.assetName}.`;
}

export async function notifyHandoff(raw: unknown): Promise<{ orderId: string; message: string; delivery: unknown }> {
  const input = handoffSchema.parse(raw);
  const message = handoffMessage(input);
  const delivery = await sendSms({ to: input.buyerPhone, body: message }, `order-${input.orderId}-${input.update}`);
  return { orderId: input.orderId, message, delivery };
}
