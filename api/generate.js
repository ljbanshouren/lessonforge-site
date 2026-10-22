// Vercel Serverless Function: POST /api/generate
// Env vars (set in Vercel dashboard → Settings → Environment Variables):
//   YAI_API_KEY  — your yairouter API key
//   MODEL_NAME   — optional, default "gpt-4o-mini"

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const { grade = "Grade 7", subject = "History", topic = "" } = req.body || {};
  if (!topic.trim()) return res.status(400).json({ error: "topic required" });

  const key = process.env.YAI_API_KEY;
  if (!key) return res.status(500).json({ error: "server not configured" });
  const model = process.env.MODEL_NAME || "gpt-4o-mini";

  const system = [
    "You are a veteran middle-school teacher who writes lesson OPENINGS in a spoken, storytelling voice.",
    "Rules:",
    "1) Open with a concrete scene: a person, a date, a mystery — never 'Today we will learn'.",
    "2) 120-160 words. Spoken rhythm. Include one pause point written as (pause — ask students…).",
    "3) End with the hook question that leads into the lesson.",
    "4) Then add: 'OBJECTIVES:' with 3 bullet objectives, and 'DISCUSS:' with 2 questions (one recall, one open).",
    "5) No em-dashes, no 'delve', no 'in conclusion', no AI clichés. Write like a person talking to 12-year-olds.",
    "6) If a fact is uncertain, say 'double-check this against your textbook' once at the end."
  ].join("\n");

  const user = `Grade: ${grade}\nSubject: ${subject}\nTopic: ${topic}\nWrite the lesson opening + objectives + discussion questions.`;

  try {
    const r = await fetch("https://api.yairouter.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        temperature: 0.8,
        max_tokens: 700
      })
    });
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: "empty completion", raw: JSON.stringify(data).slice(0, 200) });
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: String(e).slice(0, 200) });
  }
}
