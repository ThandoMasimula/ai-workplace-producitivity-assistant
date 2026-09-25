const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

type JsonSchema = Record<string, unknown>;

/**
 * Calls the Lovable AI Gateway Responses API in streaming mode and returns the
 * accumulated output text. Streaming is required; we consume it server-side.
 */
export async function callGateway(options: {
  instructions: string;
  input: string;
  schema?: { name: string; schema: JsonSchema };
}): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const body: Record<string, unknown> = {
    model: MODEL,
    input: [
      { role: "developer", content: [{ type: "input_text", text: options.instructions }] },
      { role: "user", content: [{ type: "input_text", text: options.input }] },
    ],
    stream: true,
    reasoning: { effort: "low" },
    store: false,
  };

  if (options.schema) {
    body["text"] = {
      format: {
        type: "json_schema",
        name: options.schema.name,
        strict: true,
        schema: options.schema.schema,
      },
    };
  }

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("The AI is busy right now. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits are used up. Please add credits to continue.");
    throw new Error(`AI request failed (${res.status}). ${detail.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          text += evt.delta;
        } else if (evt.type === "response.completed" && !text && evt.response?.output_text) {
          text = evt.response.output_text;
        }
      } catch {
        // ignore keep-alive / non-JSON lines
      }
    }
  }

  return text.trim();
}
