import { chromium } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const checkout = await readFile(resolve("apps/web/public/product/checkout.png"));
const checkoutData = `data:image/png;base64,${checkout.toString("base64")}`;
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });

await page.setContent(`
  <!doctype html>
  <html lang="ru">
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; }
        html, body { width: 1200px; height: 630px; margin: 0; overflow: hidden; }
        body {
          position: relative;
          background: #f5f5f7;
          color: #1d1d1f;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .brand { position: absolute; top: 46px; left: 54px; display: flex; align-items: center; gap: 10px; font-size: 22px; font-weight: 750; letter-spacing: -.5px; }
        .mark { display: flex; height: 27px; align-items: flex-end; gap: 5px; }
        .mark i { display: block; width: 7px; height: 17px; background: #1d1d1f; }
        .mark i:last-child { height: 27px; background: #a6e000; }
        .copy { position: absolute; z-index: 2; top: 160px; left: 54px; width: 660px; }
        .copy small { color: #587000; font-size: 12px; font-weight: 800; letter-spacing: 1.7px; text-transform: uppercase; }
        h1 { margin: 24px 0 0; font-size: 78px; font-weight: 680; letter-spacing: -5.8px; line-height: .92; }
        p { width: 560px; margin: 26px 0 0; color: #6e6e73; font-size: 21px; line-height: 1.38; }
        .frame {
          position: absolute;
          right: -300px;
          bottom: -182px;
          width: 850px;
          height: 545px;
          overflow: hidden;
          border: 1px solid #2b2b2e;
          border-radius: 24px;
          background: #111;
          box-shadow: 0 38px 100px rgb(0 0 0 / .2);
        }
        .bar { display: flex; height: 34px; align-items: center; gap: 6px; padding: 0 14px; background: #151515; }
        .bar i { width: 7px; height: 7px; border-radius: 50%; background: #505052; }
        .bar i:last-child { background: #a6e000; }
        .frame img { display: block; width: 100%; height: calc(100% - 34px); object-fit: cover; object-position: left top; }
        .accent { position: absolute; right: 0; top: 0; width: 13px; height: 100%; background: #a6e000; }
      </style>
    </head>
    <body>
      <div class="brand"><span class="mark"><i></i><i></i></span><span>DinoPOS</span></div>
      <main class="copy">
        <small>Одна смена с DinoPOS</small>
        <h1>Магазин работает<br />в своём ритме.</h1>
        <p>Продажи, товары, смены и остатки — в одном понятном рабочем пространстве.</p>
      </main>
      <div class="frame"><div class="bar"><i></i><i></i><i></i></div><img src="${checkoutData}" alt="" /></div>
      <div class="accent"></div>
    </body>
  </html>
`);

await page.locator(".frame img").evaluate(async (image) => image.decode());
await page.screenshot({ path: resolve("apps/web/public/og.png") });
await browser.close();
