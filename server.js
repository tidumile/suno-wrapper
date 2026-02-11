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

  console.log("🔐 Otvaram Suno login...");

  await page.goto("https://suno.com/login", {
    waitUntil: "networkidle"
  });

  // Unos email
  await page.fill('input[type="email"]', process.env.SUNO_EMAIL);

  await page.click('button:has-text("Continue"), button:has-text("Next")');

  // Sačekaj password polje
  await page.waitForSelector('input[type="password"]', {
    timeout: 10000
  });

  // Unos password
  await page.fill('input[type="password"]', process.env.SUNO_PASSWORD);

  await page.click('button:has-text("Log in"), button:has-text("Sign in")');

  // Sačekaj redirect posle login-a
  await page.waitForLoadState("networkidle");

  console.log("✅ Ulogovan na Suno");
}

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    console.log("🎵 Generišem:", prompt);

    await page.goto("https://suno.com/create", {
      waitUntil: "networkidle"
    });

    // Sačekaj textarea
    await page.waitForSelector("textarea", { timeout: 15000 });

    await page.fill("textarea", prompt);

    // Klik na Create dugme
    await page.click('button:has-text("Create")');

    console.log("🚀 Kliknut Create");

    res.json({ status: "ok" });

  } catch (err) {
    console.error("❌ Greška:", err);
    res.status(500).json({ error: "Generation failed" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log("🚀 Wrapper starting...");
  await initBrowser();
  console.log(`🚀 Wrapper running on port ${PORT}`);
});

