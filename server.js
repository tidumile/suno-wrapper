import express from "express";
import { chromium } from "playwright";

const app = express();
app.use(express.json());

let browser;
let page;

async function initBrowser() {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();

  await page.goto("https://suno.com");
  console.log("👉 Uloguj se u Suno u browseru koji se otvori");
}

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  await page.goto("https://suno.com/create");
  await page.fill("textarea", prompt);
  await page.click("button:has-text('Generate')");

  res.json({ status: "ok" });
});

app.listen(3000, async () => {
  await initBrowser();
  console.log("🚀 Wrapper running on port 3000");
});
