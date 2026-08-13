import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

async function run() {
  try {
    const formattedMessages = [{ role: 'user', parts: [{ text: 'hello' }] }];
    const responseStream = await model.generateContentStream({
      contents: formattedMessages
    });
    for await (const chunk of responseStream.stream) {
      console.log(chunk.text());
    }
  } catch (e) {
    console.error("DEBUG ERROR:", e);
  }
}
run();
