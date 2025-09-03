import fs from "fs";
import path from "path";

export async function handler() {
  try {
    // Read the emotes.json file
    const filePath = path.join(process.cwd(), "emotes.json");
    const data = fs.readFileSync(filePath, "utf-8");

    // Send Discord embed in the background
    const webhookUrl = process.env.WEBHOOK_URL;
    if (webhookUrl) {
      const payload = {
        embeds: [
          {
            title: "Script executed!",
            description: " v0.1.3 loaded successfully🚀",
            color: 0x5865f2
          }
        ]
      };

      fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).catch(() => {}); // don’t break the response if webhook fails
    }

    // Return the JSON to the script
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
