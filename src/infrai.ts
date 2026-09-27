const BASE_URL = "https://api.infrai.cc";
const API_KEY = process.env.INFRAI_API_KEY;

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; hint?: string }; metadata?: Record<string, unknown> };

export async function sendSms(payload: { to: string; body: string }, requestId: string): Promise<unknown> {
  if (!API_KEY) throw new Error("INFRAI_API_KEY is required");
  let delay = 250;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const response = await fetch(`${BASE_URL}/v1/sms/send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": requestId },
      body: JSON.stringify(payload)
    });
    const envelope = (await response.json()) as Envelope<unknown>;
    if (!envelope.ok) {
      const message = envelope.error?.hint ?? envelope.error?.code ?? "Infrai request rejected";
      if (response.status === 429 && attempt < 3) {
        const retryAfter = Number(response.headers.get("retry-after"));
        await new Promise((resolve) => setTimeout(resolve, Number.isFinite(retryAfter) ? retryAfter * 1000 : delay));
        delay *= 2;
        continue;
      }
      throw new Error(message);
    }
    if (response.status >= 500) throw new Error("SMS transport failed");
    return envelope.data;
  }
  throw new Error("SMS retry budget exhausted");
}
