import fs from 'fs';
let content = fs.readFileSync('src/services/ai.ts', 'utf-8');

const retryLogic = `
    let result;
    try {
      result = await model.generateContent(prompt);
    } catch (e: any) {
      if (e.status === 429) {
        console.warn("Rate limited by Gemini, waiting 15s...");
        await new Promise(r => setTimeout(r, 15000));
        result = await model.generateContent(prompt);
      } else {
        throw e;
      }
    }
`;

content = content.replace(/const result = await model\.generateContent\(prompt\);/g, retryLogic);
fs.writeFileSync('src/services/ai.ts', content, 'utf-8');
console.log("Patched ai.ts with retry logic");
