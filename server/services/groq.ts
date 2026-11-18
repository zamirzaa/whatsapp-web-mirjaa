import { db } from '../db';

interface ReplyContext {
  contactId: string;
  contactName: string;
  contactAbout?: string;
  userMessage: string;
  apiKey?: string;
  model?: string;
}

export async function generateGroqReply(ctx: ReplyContext): Promise<string> {
  const { contactName, userMessage } = ctx;

  let activeApiKey = ctx.apiKey || process.env.GROQ_API_KEY;

  if (!activeApiKey) {
    try {
      const setting = db.prepare("SELECT groq_api_key FROM user_settings WHERE user_id = 'usr_mirza'").get() as any;
      if (setting?.groq_api_key) {
        activeApiKey = setting.groq_api_key;
      }
    } catch {
      // ignore
    }
  }

  const systemInstruction = `Kamu adalah teman chat WhatsApp bernama ${contactName}. Jawab langsung ke inti pertanyaan, 1-2 kalimat pendek santai, bahasa Indonesia sehari-hari, jangan terlalu kaku/formal.`;

  if (activeApiKey && activeApiKey.trim().length > 0) {
    const rawModel = (ctx.model || process.env.GROQ_MODEL || 'openai/gpt-oss-120b').trim();
    // Candidate models to ensure compatibility with Groq API naming conventions
    const candidateModels = [
      rawModel,
      rawModel.replace(/^groq\//, ''),
      'openai/gpt-oss-120b',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
    ];
    const modelsToTry = Array.from(new Set(candidateModels));

    for (const modelName of modelsToTry) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${activeApiKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: userMessage },
            ],
            temperature: 0.7,
            max_tokens: 150,
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as any;
          const reply = data?.choices?.[0]?.message?.content;
          if (reply && typeof reply === 'string' && reply.trim().length > 0) {
            return reply.trim().replace(/^["']|["']$/g, '').replace(/^\*\s*/gm, '');
          }
        } else {
          const errText = await response.text();
          console.warn(`[Groq AI] Model '${modelName}' returned HTTP ${response.status}:`, errText);
          if (response.status === 401) {
            break; // Stop trying other models if API key is invalid
          }
        }
      } catch (err: any) {
        console.warn(`[Groq AI] Request error with model '${modelName}':`, err.message);
      }
    }
  }

  // Smart Contextual Persona Engine (Used while user hasn't input their Groq API Key yet)
  const lower = userMessage.toLowerCase();
  if (lower.includes('apa kabar') || lower.includes('kabarmu')) {
    return 'Alhamdulillah baik bro! Lagi santai aja nih. Kamu sendiri gimana?';
  }
  if (lower.includes('valorant') || lower.includes('game') || lower.includes('main')) {
    return 'Wah boleh tuh! Gas jam berapa kita mabar?';
  }
  if (lower.includes('halo') || lower.includes('hi') || lower.includes('p ')) {
    return 'Halo juga! Ada yang seru nggak hari ini?';
  }
  if (lower.includes('dimana') || lower.includes('tempat') || lower.includes('keluar')) {
    return 'Hmm gimana kalau nongkrong di tempat biasa kita ngopi?';
  }
  if (lower.includes('terima kasih') || lower.includes('makasih')) {
    return 'Sama-sama bro, santai aja! 👍';
  }

  const contextuals = [
    `Wah iya juga ya, baru tau gw. Ceritain lagi dong soal ${userMessage.slice(0, 20)}...`,
    `Menarik tuh! Gimana kelanjutannya?`,
    `Siap bro, nanti gw infokan lagi ya.`,
    `Haha bener banget lu. Ada-ada aja.`,
    `Wah mantap tuh! Sukses terus ya.`
  ];
  return contextuals[Math.floor(Math.random() * contextuals.length)];
}

export const generateGeminiReply = generateGroqReply;
