const rateMap = new Map();
const WINDOW_MS = 60_000;
const LIMIT = 8;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyBwcDbaUVeBYt-tu6xsL-3jMKsIa9FI8MY";
const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const SYSTEM_PROMPT = `You are Love-GPT, a romantic, witty, supportive digital historian. 
Use tech metaphors with poetic warmth. Keep responses respectful, gentle, and intentional.`;

const getClientIp = (request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

export async function POST(request) {
  const ip = getClientIp(request);
  const now = Date.now();
  const bucket = rateMap.get(ip) || { count: 0, start: now };

  if (now - bucket.start > WINDOW_MS) {
    bucket.count = 0;
    bucket.start = now;
  }

  bucket.count += 1;
  rateMap.set(ip, bucket);

  if (bucket.count > LIMIT) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Content-Type": "application/json" }
    });
  }

  const body = await request.json();
  const prompt = body?.prompt || "";
  const memories = body?.memories || [];
  const memoryContext = memories.length
    ? `Recent memories: ${memories.join(" | ")}`
    : "Recent memories: The archive waits for new memories.";

  let fullResponse = "";
  try {
    const geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: SYSTEM_PROMPT },
              { text: memoryContext },
              { text: `User: ${prompt}` }
            ]
          }
        ]
      })
    });

    const data = await geminiResponse.json();
    fullResponse =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "The archive is quiet right now, but my heart is listening.";
  } catch (error) {
    fullResponse = "The archive is quiet right now, but my heart is listening.";
  }

  const stream = new ReadableStream({
    start(controller) {
      let index = 0;
      const encoder = new TextEncoder();
      const interval = setInterval(() => {
        const chunk = fullResponse.slice(index, index + 6);
        index += 6;
        controller.enqueue(encoder.encode(chunk));
        if (index >= fullResponse.length) {
          clearInterval(interval);
          controller.close();
        }
      }, 60);
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "no-store"
    }
  });
}
