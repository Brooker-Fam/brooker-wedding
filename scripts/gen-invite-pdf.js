/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Generate the printable PDF invite for Sapphire's birthday party.
 *
 *   pnpm run gen:invite-pdf
 *
 * Writes to public/sapphire/invite.pdf, which is then served at /sapphire/invite.
 * Re-run after editing any wording.
 *
 * PDFKit's built-in fonts use WinAnsiEncoding, so non-Latin glyphs (Unicode
 * superscripts, decorative symbols like ✦/✨) render as garbage. Stick to
 * WinAnsi-safe characters and synthesize superscripts via positioned text.
 */

const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

const RSVP_URL = "https://brooker.family/sapphire";
const OUT = path.resolve(__dirname, "..", "public", "sapphire", "invite.pdf");

const PAGE_W = 612;
const PAGE_H = 792;
const FOREST = "#244A2B";
const PLUM = "#78597C";
const BLUSH = "#F4B8C4";
const CREAM = "#F1EAD5";
const PALE_SAGE = "#E8F0DD";
const INK = "#244A2B";
const MUTED = "#38653A";
const FAINT = "#78597C";
const RULE = "#C7B5C9";

async function main() {
  const doc = new PDFDocument({
    size: "LETTER",
    margins: { top: 54, bottom: 54, left: 54, right: 54 },
    info: {
      Title: "Sapphire's 9th Birthday Invitation",
      Author: "Matt & Brittany Brooker",
      Subject: "Birthday party invitation",
    },
  });
  doc.pipe(fs.createWriteStream(OUT));

  const ML = 54;
  const MR = 54;
  const MT = 54;
  const contentW = PAGE_W - ML - MR;
  const centerX = PAGE_W / 2;

  doc.rect(0, 0, PAGE_W, PAGE_H).fill(PALE_SAGE);
  doc.save();
  doc.fillColor(CREAM).fillOpacity(0.8).rect(0, PAGE_H * 0.32, PAGE_W, PAGE_H * 0.68).fill();
  doc.fillColor(BLUSH).fillOpacity(0.22).circle(105, 100, 80).fill();
  doc.fillColor("#DDE7B0").fillOpacity(0.38).circle(PAGE_W - 105, 135, 95).fill();
  doc.fillOpacity(1);
  doc.restore();

  let y = MT;
  drawFlourish(doc, centerX, y + 8, PLUM);
  y += 28;

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(FAINT)
    .text("YOU'RE  INVITED  TO", ML, y, {
      width: contentW,
      align: "center",
      characterSpacing: 2.2,
    });
  y += 24;

  doc
    .font("Times-Roman")
    .fontSize(72)
    .fillColor(FOREST)
    .text("Sapphire’s", ML, y, { width: contentW, align: "center" });
  y += 80;

  // Divider + fairy wings + divider
  const dividerW = 110;
  const gemW = 34;
  const gap = 14;
  const groupW = dividerW * 2 + gemW + gap * 2;
  const groupX = (PAGE_W - groupW) / 2;
  const midY = y + 12;
  doc.save();
  doc.strokeColor(PLUM).strokeOpacity(0.55).lineWidth(1);
  doc.moveTo(groupX, midY).lineTo(groupX + dividerW, midY).stroke();
  doc
    .moveTo(groupX + dividerW + gap + gemW + gap, midY)
    .lineTo(groupX + dividerW * 2 + gap * 2 + gemW, midY)
    .stroke();
  doc.restore();
  drawFairyWings(doc, groupX + dividerW + gap + gemW / 2, midY, gemW, PLUM);
  y += 30;

  // "Fairy Forest 9th Birthday" — synthesize the "th" as a smaller, raised glyph
  // because the standard fonts don't have Unicode superscripts.
  drawHeadlineWithSuperscript(doc, y, ML, contentW, {
    pre: "Fairy Forest 9",
    sup: "th",
    post: " Birthday",
    font: "Times-Italic",
    baseSize: 38,
    supSize: 20,
    color: PLUM,
  });
  y += 46;

  doc
    .font("Times-Italic")
    .fontSize(15)
    .fillColor(MUTED)
    .text("A fun filled day at Moreau Lake", ML, y, {
      width: contentW,
      align: "center",
    });
  y += 24;

  doc
    .font("Helvetica")
    .fontSize(12)
    .fillColor(FOREST)
    .text(
      "Sapphire is turning 9 years old! Join us for a fun filled day at Moreau Lake to celebrate with swimming, pizza, and cake.",
      ML + 55,
      y,
      { width: contentW - 110, align: "center", lineGap: 3 }
    );
  y += 50;

  // Date box
  const dateBoxX = ML + 60;
  const dateBoxW = contentW - 120;
  const dateBoxY = y;
  const dateBoxH = 110;
  doc.save();
  doc
    .roundedRect(dateBoxX, dateBoxY, dateBoxW, dateBoxH, 14)
    .fillColor("#FFFFFF")
    .fillOpacity(0.38)
    .fill()
    .strokeColor(PLUM)
    .strokeOpacity(0.35)
    .lineWidth(0.8)
    .stroke();
  doc.fillOpacity(1).strokeOpacity(1);
  doc.restore();

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(PLUM)
    .text("SAVE  THE  DATE", dateBoxX, dateBoxY + 12, {
      width: dateBoxW,
      align: "center",
      characterSpacing: 2.4,
    });

  doc
    .font("Times-Italic")
    .fontSize(18)
    .fillColor(MUTED)
    .text("Saturday", dateBoxX, dateBoxY + 28, { width: dateBoxW, align: "center" });

  doc
    .font("Times-Bold")
    .fontSize(38)
    .fillColor(FOREST)
    .text("June 20, 2026", dateBoxX, dateBoxY + 50, {
      width: dateBoxW,
      align: "center",
    });

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(PLUM)
    .text("11:00 AM  –  3:00 PM", dateBoxX, dateBoxY + 92, {
      width: dateBoxW,
      align: "center",
      characterSpacing: 1.5,
    });

  y = dateBoxY + dateBoxH + 28;

  // Two-column section: Where | What to Expect
  const colGap = 26;
  const colW = (contentW - colGap) / 2;
  const leftX = ML;
  const rightX = ML + colW + colGap;
  const sectionY = y;

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(PLUM)
    .text("WHERE", leftX, sectionY, { characterSpacing: 2.4 });

  doc
    .font("Times-Bold")
    .fontSize(22)
    .fillColor(FOREST)
    .text("Moreau Lake", leftX, sectionY + 16);
  doc.text("State Park", leftX, sectionY + 38);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(MUTED)
    .text("605 Old Saratoga Rd", leftX, sectionY + 72)
    .text("Gansevoort, NY", leftX, sectionY + 86);

  doc
    .strokeColor(RULE)
    .lineWidth(0.5)
    .moveTo(rightX - colGap / 2, sectionY)
    .lineTo(rightX - colGap / 2, sectionY + 110)
    .stroke();

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(PLUM)
    .text("WHAT  TO  EXPECT", rightX, sectionY, { characterSpacing: 2.4 });

  const bullets = [
    "Pizza party - bring an appetite!",
    "Birthday cake after lake time",
    "Swimming – bring suits & towels",
    "Playground near the beach",
    "Sunscreen & bug spray",
  ];
  let bulletY = sectionY + 20;
  bullets.forEach((b) => {
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(PLUM)
      .text("•", rightX, bulletY, { width: 10 });
    doc
      .font("Helvetica")
      .fontSize(11.5)
      .fillColor(INK)
      .text(b, rightX + 14, bulletY, { width: colW - 14 });
    bulletY += 18;
  });

  y = sectionY + 130;

  // RSVP row
  const rsvpY = y + 30;
  const qrSize = 94;
  const qrX = ML + contentW - qrSize - 10;
  const qrY = rsvpY;

  const qrBuffer = await QRCode.toBuffer(RSVP_URL, {
    type: "png",
    margin: 0,
    color: { dark: FOREST, light: "#FFFFFF" },
    width: 320,
  });

  doc
    .roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 12)
    .fillColor("#FFFFFF")
    .fillOpacity(0.58)
    .fill()
    .strokeColor(PLUM)
    .strokeOpacity(0.35)
    .lineWidth(0.8)
    .stroke();
  doc.fillOpacity(1).strokeOpacity(1);

  doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(PLUM)
    .text("KINDLY  RSVP", leftX, rsvpY + 4, { characterSpacing: 2.4 });

  doc
    .font("Times-Bold")
    .fontSize(24)
    .fillColor(FOREST)
    .text("brooker.family/sapphire", leftX, rsvpY + 22);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(MUTED)
    .text("Scan the code, or text Matt at 814-876-2231.", leftX, rsvpY + 46, {
      width: contentW - qrSize - 30,
    });

  // Footer
  const footerY = PAGE_H - MT - 26;
  drawFlourish(doc, centerX, footerY, PLUM, true);
  doc
    .font("Times-Italic")
    .fontSize(18)
    .fillColor(MUTED)
    .text("with love, Sapphire", ML, footerY + 18, {
      width: contentW,
      align: "center",
    });

  doc.end();
  console.log("PDF written:", OUT);
}

function drawHeadlineWithSuperscript(doc, y, ML, contentW, opts) {
  const { pre, sup, post, font, baseSize, supSize, color } = opts;
  doc.font(font).fillColor(color);
  doc.fontSize(baseSize);
  const wPre = doc.widthOfString(pre);
  doc.fontSize(supSize);
  const wSup = doc.widthOfString(sup);
  doc.fontSize(baseSize);
  const wPost = doc.widthOfString(post);
  const totalW = wPre + wSup + wPost;
  const startX = ML + (contentW - totalW) / 2;

  doc.fontSize(baseSize).text(pre, startX, y, { lineBreak: false });
  // Raise "th" by ~25% of baseSize for a proper superscript look
  doc
    .fontSize(supSize)
    .text(sup, startX + wPre, y + 2, { lineBreak: false });
  doc
    .fontSize(baseSize)
    .text(post, startX + wPre + wSup, y, { lineBreak: false });
}

function drawFlourish(doc, cx, cy, color, flip = false) {
  const w = 220;
  const dir = flip ? -1 : 1;
  doc.save();
  doc.strokeColor(color).strokeOpacity(0.55).lineWidth(0.8);
  doc
    .moveTo(cx - w / 2, cy)
    .bezierCurveTo(
      cx - w / 4, cy - 6 * dir,
      cx + w / 4, cy + 6 * dir,
      cx + w / 2, cy
    )
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
