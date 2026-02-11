import express from "express";
import { chromium } from "playwright";

const app = express();
app.use(express.json());

let browser;
let page;

async function initBrowser() {
 await page.goto("https://suno.com/login", { waitUntil: "networkidle" });
await page.fill('input[type="email"]', process.env.SUNO_EMAIL);
...
console.log("✅ Ulogovan na Suno");
}

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  await page.goto("https://suno.com/create");
  await page.fill("textarea", prompt);
  await page.click("button:has-text('Create')");

  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await initBrowser();
  console.log(`🚀 Wrapper running on port ${PORT}`);
});
