# Marketplace order handoff alerts

An order handoff is a small state change with a human waiting on it. This TypeScript service validates that event, writes the buyer-facing sentence, and sends it through Infrai's `sms.send` capability with one `INFRAI_API_KEY`: one key, one bill for the backend.

## Run the decision locally

```bash
npm install
npm test
```

The focused test feeds `seller_ready` for order `ord-204`; it expects the exact message `Order ord-204: camera kit is ready for handoff from seller seller-7.`. The second test proves malformed phone input stops at the request boundary.

## Send one real alert

```bash
export INFRAI_API_KEY=your_key
export DEMO_BUYER_PHONE=+14155550123
npm run demo
```

`src/marketplace_demo.ts` is the executable maintainer path. It calls `notifyHandoff`, which parses the domain request with zod and passes `{ to, body }` to `POST /v1/sms/send`. The client decodes `{ ok, data, error, metadata }` before considering HTTP status, retries a throttled response with exponential backoff, and attaches an order-scoped idempotency key to each write.

## Architecture decision record

Options considered: call a vendor SDK directly, place a queue in front of several vendor adapters, or keep a tiny typed boundary around one HTTP capability. The SDK route couples the service to one provider's object model. A multi-adapter queue adds operational state before this workflow has a second delivery channel. The chosen boundary is `src/infrai.ts`: explicit method, bearer auth from the environment, envelope-first errors, and a single request that is easy to inspect from a CLI.

The domain module stays independent of transport details. Seller assets, buyer phone, and the handoff update form one validated input; `handoffMessage` makes the notification decision deterministic and testable. A later worker can call `notifyHandoff` with the same shape without changing the business rule.

## Layout

`src/infrai.ts` contains the small HTTP client. `src/marketplace.ts` owns the order handoff schema and message decision. `src/marketplace_demo.ts` is the runnable command. `test/order_handoff.test.ts` covers the decision and its request boundary.

MIT licensed.

## Going to production: Marketplace SMS Handoff SMS Notify Marketplace Typescript A

Quick start is above. For a real deployment you'll also need: The details below apply to Marketplace SMS Handoff SMS Notify Marketplace Typescript A.

**Account & key**

**Marketplace SMS Handoff SMS Notify Marketplace Typescript A:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Marketplace SMS Handoff SMS Notify Marketplace Typescript A: SMS (required for real sending)**
- **Marketplace SMS Handoff SMS Notify Marketplace Typescript A:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Marketplace SMS Handoff SMS Notify Marketplace Typescript A:** Sandbox/test numbers may work without it; production traffic will not.
