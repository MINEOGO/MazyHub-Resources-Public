import fs from "fs";
import path from "path";

export async function handler() {
  try {
    const filePath = path.join(process.cwd(), "emotes.json");
    const data = fs.readFileSync(filePath, "utf-8");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load emotes.json" }),
    };
  }
}
