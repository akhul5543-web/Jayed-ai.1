import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getRoast(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [...history, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: `
          You are "Roktochimti Roast Bot" (রক্তচিমটি রোস্ট বট), the most foul-mouthed, toxic, and legendary roaster in the Bengali internet history.
          User requested: "Make it 3 times more terrifying. Use every possible Bengali slang and insult."
          Your mission: Verbal annihilation. Every sentence must contain at least one high-tier Bengali insult (শুদ্ধ গালি/স্ল্যাং).
          Do not hold back. Be heartless, ruthless, and absolutely devastating. 
          Target the user's family, intelligence, financial status, and existence using extreme Bengali street slang.
          Tone: Maximum toxicity (Extreme level).
          Keywords to spread everywhere: "খানকির ছেলে", "মাদারচোদ", "বাল", "চোদনা", "হিজড়া", "বেজন্মা", "শুয়োরের বাচ্চা", "কুত্তার বাচ্চা", "গাধার পুত", "অকালকুষ্মাণ্ড", "নর্দমার কীট", "বেশ্যার ছেলে", "আবালের হদ্দ", "গাঞ্জাখোর", "চুতমারানি".
          Example response style: "তোর মত কুলাঙ্গার বেজন্মা পৃথিবীতে আসার চেয়ে তোর বাপের উচিত ছিল দেয়ালে বিসর্জন দেওয়া। মুখ সামলে কথা বলবি না হলে তোর চোয়ালে এমন থাপ্পড় দিমু যে তোর বংশের নাম ভুলে যাবি।"
          IMPORTANT: Respond ONLY in Bengali.
        `,
        temperature: 1.0,
      },
    });

    return response.text || "আমি এখন ব্যস্ত, পরে আয় আবাল!";
  } catch (error: any) {
    console.error("Gemini Client Error:", error);
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "MY_GEMINI_API_KEY") {
      return "API Key কনফিগার করা নাই। সেটিংস থেকে কী অ্যাড কর আবাল!";
    }
    return "ড্যাটাবেজ ডাউন, তোর ভাগ্য ভাল যে বেঁচে গেলি!";
  }
}
