import puppeteer from "puppeteer";
import type { Order } from "./types";
import { renderOrderReceiptHtml } from "./email";

export async function generateReceiptPdf(order: Order): Promise<Buffer> {
  const html = renderOrderReceiptHtml(order);

  const browser = await puppeteer.launch();
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
