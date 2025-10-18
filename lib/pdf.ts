import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import type { Order } from "./types";
import { renderOrderReceiptHtml } from "./email";

export async function generateReceiptPdf(order: Order): Promise<Uint8Array> {
  const html = renderOrderReceiptHtml(order);

  // Use different Chrome executable based on environment
  const browser = await puppeteer.launch({
    args: process.env.NODE_ENV === 'production' 
      ? chromium.args 
      : ['--no-sandbox', '--disable-setuid-sandbox'],
    defaultViewport: { width: 1280, height: 720 },
    executablePath: process.env.NODE_ENV === 'production'
      ? await chromium.executablePath()
      : process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
    headless: true,
  });
  
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const dimensions = await page.evaluate(() => {
    const container = document.querySelector(".container");
    if (container) {
      return {
        width: container.scrollWidth,
        height: container.scrollHeight,
      };
    }
    return { width: 595, height: 842 }; // A4 fallback
  });

  const pdfBuffer = await page.pdf({
    width: `${dimensions.width}px`,
    height: `${dimensions.height}px`,
    printBackground: true,
  });

  await browser.close();

  return pdfBuffer;
}
