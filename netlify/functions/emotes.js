import fs from "fs";
import path from "path";
import fetch from "node-fetch"; // <-- add this

export async function handler() {
  try {
    // read emotes.json
    const filePath = path.join(process.cwd(), "emotes.json");
    const data = fs.readFileSync(filePath, "utf-8");

    // get webhook url from env
    const webhookUrl = process.env.WEBHOOK_URL;

    if (webhookUrl) {
      const payload = {
        embeds: [
          {
            title: "Script executed!",
            description: "v0.1.3 loaded successfully 🚀",
            color: 0x5865f2
          }
        ]
      };

      // fire webhook but don't block response
      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(err => console.error("Webhook failed:", err));
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
