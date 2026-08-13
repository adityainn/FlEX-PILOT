import dotenv from "dotenv";
dotenv.config();

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Hello!" }] }]
    })
  });
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}

main();
