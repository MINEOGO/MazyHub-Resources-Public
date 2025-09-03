import fs from "fs";
import path from "path";

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
            description: "Someone visited **/api/emotes** 🚀",
            color: 0x5865f2,
          },
        ],
      };

      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.error("Webhook failed:", err));
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
