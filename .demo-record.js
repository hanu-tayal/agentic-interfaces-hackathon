// Records a 90-second demo video of the Bedtime School Bridge.
// Drives the app through: balanced → calmer → sillier → freeform.
// Output: /tmp/demo.webm

const { chromium } = require("playwright");
const path = require("node:path");

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: "/tmp/demo-video", size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3010");
  await page.waitForTimeout(3000);

  const click = async (text) => {
    const btn = page.locator("button", { hasText: text }).first();
    await btn.click();
  };

  // Beat 1: Balanced (default)
  await page.waitForTimeout(2500);

  // Beat 2: Tap a story page advance (next arrow)
  const nextArrows = page.locator('button:has(svg.lucide-chevron-right), button:has(svg[class*="ChevronRight"])');
  if (await nextArrows.count()) {
    await nextArrows.first().click();
  }
  await page.waitForTimeout(2500);

  // Beat 3: Click "calmer"
  await click("calmer");
  await page.waitForTimeout(4000);

  // Beat 4: Click "Listen" tab
  await click("Listen");
  await page.waitForTimeout(3500);

  // Beat 5: Tap "Play story" button
  try { await click("Play story"); } catch {}
  await page.waitForTimeout(4000);

  // Beat 6: Click "sillier"
  await click("sillier");
  await page.waitForTimeout(2000);

  // Beat 7: Switch back to Tonight
  await click("Tonight");
  await page.waitForTimeout(4000);

  // Beat 8: Click "balanced" to show layout reorganize once more
  await click("balanced");
  await page.waitForTimeout(4000);

  await context.close();
  await browser.close();

  // Move recording to predictable name
  const fs = require("node:fs");
  const files = fs.readdirSync("/tmp/demo-video");
  const webm = files.find((f) => f.endsWith(".webm"));
  if (webm) {
    fs.renameSync(path.join("/tmp/demo-video", webm), "/tmp/demo.webm");
    console.log("Recorded:", "/tmp/demo.webm");
  } else {
    console.log("No webm found in /tmp/demo-video");
  }
})();
