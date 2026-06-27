/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Generate the printable "Share Your Photos" table sign.
 *
 *   pnpm run gen:photos-qr
 *
 * Writes to public/photos-sign.pdf, served at /photos-sign.pdf.
 * The QR points guests to brooker.family/photos.
 *
 * PDFKit's built-in fonts use WinAnsiEncoding, so stick to Latin characters and
 * draw decorative flourishes as vectors (no emoji / Unicode symbols).
 */

const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const PHOTOS_URL = "https://brooker.family/photos";
const OUT = path.resolve(__dirname, "..", "public", "photos-sign.pdf");

const PAGE_W = 612;
const PAGE_H = 792;
const FOREST = "#244A2B";
const PLUM = "#78597C";
const BLUSH = "#F4B8C4";
const CREAM = "#F1EAD5";
const PALE_SAGE = "#E8F0DD";
const MUTED = "#38653A";
const FAINT = "#78597C";

async function main() {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 54, bottom: 54, left: 54, right: 54 },
    info: {
      Title: "Share Your Photos — Matt & Brittany",
      Author: "Matt & Brittany Brooker",
      Subject: "Guest photo sharing",
    },
  });
  doc.pipe(fs.createWriteStream(OUT));

  const ML = 54;
  const contentW = PAGE_W - ML * 2;
  const centerX = PAGE_W / 2;

  doc.rect(0, 0, PAGE_W, PAGE_H).fill(PALE_SAGE);
  doc.save();
  doc.fillColor(CREAM).fillOpacity(0.85).rect(0, PAGE_H * 0.3, PAGE_W, PAGE_H * 0.7).fill();
  doc.fillColor(BLUSH).fillOpacity(0.22).circle(105, 110, 80).fill();
  doc.fillColor("#DDE7B0").fillOpacity(0.4).circle(PAGE_W - 105, 150, 95).fill();
  doc.fillOpacity(1);
  doc.restore();

  let y = 70;
  drawFlourish(doc, centerX, y, PLUM);
  y += 26;

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(FAINT)
    .text("OUR  CELEBRATION", ML, y, { width: contentW, align: "center", characterSpacing: 2.6 });
  y += 26;

  doc
    .font("Times-Roman")
    .fontSize(60)
    .fillColor(FOREST)
    .text("Share the Magic", ML, y, { width: contentW, align: "center" });
  y += 74;

  drawFairyWings(doc, centerX, y + 6, 36, PLUM);
  y += 30;

  doc
    .font("Times-Italic")
    .fontSize(18)
    .fillColor(MUTED)
    .text("Help us capture every moment of the day", ML, y, { width: contentW, align: "center" });
  y += 34;

  doc
    .font("Helvetica")
    .fontSize(13)
    .fillColor(FOREST)
    .text(
      "Scan to add your photos & videos to our shared album. No app, no sign-up — they appear for everyone instantly.",
      ML + 40,
      y,
      { width: contentW - 80, align: "center", lineGap: 4 }
    );
  y += 62;

  const qrSize = 240;
  const qrX = centerX - qrSize / 2;
  const qrY = y;
  const qrBuffer = await QRCode.toBuffer(PHOTOS_URL, {
    type: "png",
    margin: 1,
    color: { dark: FOREST, light: "#FFFFFF" },
    width: 720,
  });

  doc
    .roundedRect(qrX - 16, qrY - 16, qrSize + 32, qrSize + 32, 18)
    .fillColor("#FFFFFF")
    .fillOpacity(0.7)
    .fill()
    .strokeColor(PLUM)
    .strokeOpacity(0.35)
    .lineWidth(1)
    .stroke();
  doc.fillOpacity(1).strokeOpacity(1);
  doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
  y += qrSize + 34;

  doc
    .font("Times-Bold")
    .fontSize(28)
    .fillColor(FOREST)
    .text("brooker.family/photos", ML, y, { width: contentW, align: "center" });
  y += 38;

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(MUTED)
    .text("Point your phone camera at the code, then tap the link.", ML, y, {
      width: contentW,
      align: "center",
    });

  const footerY = PAGE_H - 96;
  drawFlourish(doc, centerX, footerY, PLUM, true);
  doc
    .font("Times-Italic")
    .fontSize(13)
    .fillColor(FAINT)
    .text("Matt & Brittany  -  June 27, 2026", ML, footerY + 12, {
      width: contentW,
      align: "center",
      lineBreak: false,
    });

  doc.end();
  console.log("PDF written:", OUT);
}

function drawFlourish(doc, cx, cy, color, flip = false) {
  const w = 220;
  const dir = flip ? -1 : 1;
  doc.save();
  doc.strokeColor(color).strokeOpacity(0.55).lineWidth(0.8);
  doc
    .moveTo(cx - w / 2, cy)
    .bezierCurveTo(cx - w / 4, cy - 6 * dir, cx + w / 4, cy + 6 * dir, cx + w / 2, cy)
    .stroke();
  doc.restore();
  doc.save();
  doc.fillColor(color).fillOpacity(0.7);
  doc.circle(cx - w / 3, cy - 0.5 * dir, 1).fill();
  doc.circle(cx, cy + 0.5 * dir, 2.5).fill();
  doc.circle(cx + w / 3, cy - 0.5 * dir, 1).fill();
  doc.restore();
}

function drawFairyWings(doc, cx, cy, size, color) {
  const r = size / 2;
  doc.save();
  doc.strokeColor(color).lineWidth(0.8);
  doc.fillColor(BLUSH).fillOpacity(0.72);
  doc
    .moveTo(cx - 1, cy)
    .bezierCurveTo(cx - r * 0.7, cy - r, cx - r * 1.35, cy - r * 0.8, cx - r * 1.2, cy)
    .bezierCurveTo(cx - r * 1.05, cy + r * 0.7, cx - r * 0.25, cy + r * 0.65, cx - 1, cy + r * 0.18)
    .fillAndStroke();
  doc
    .moveTo(cx + 1, cy)
    .bezierCurveTo(cx + r * 0.7, cy - r, cx + r * 1.35, cy - r * 0.8, cx + r * 1.2, cy)
    .bezierCurveTo(cx + r * 1.05, cy + r * 0.7, cx + r * 0.25, cy + r * 0.65, cx + 1, cy + r * 0.18)
    .fillAndStroke();
  doc.fillColor("#DDE7B0").fillOpacity(0.78);
  doc
    .moveTo(cx - 1, cy + r * 0.2)
    .bezierCurveTo(cx - r * 0.55, cy + r * 0.65, cx - r * 0.62, cy + r * 1.3, cx - r * 0.05, cy + r * 0.98)
    .bezierCurveTo(cx + r * 0.1, cy + r * 0.8, cx + r * 0.05, cy + r * 0.35, cx - 1, cy + r * 0.2)
    .fillAndStroke();
  doc
    .moveTo(cx + 1, cy + r * 0.2)
    .bezierCurveTo(cx + r * 0.55, cy + r * 0.65, cx + r * 0.62, cy + r * 1.3, cx + r * 0.05, cy + r * 0.98)
    .bezierCurveTo(cx - r * 0.1, cy + r * 0.8, cx - r * 0.05, cy + r * 0.35, cx + 1, cy + r * 0.2)
    .fillAndStroke();
  doc.fillOpacity(1).fillColor("#FFF7D0");
  doc.ellipse(cx, cy + r * 0.18, r * 0.12, r * 0.48).fill();
  doc.circle(cx, cy - r * 0.35, r * 0.16).fill();
  doc.restore();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
