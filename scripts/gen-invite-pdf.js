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
const NAVY = "#1B2A5C";
const INK = "#1f2937";
const MUTED = "#4b5563";
const FAINT = "#6b7280";
const RULE = "#d1d5db";

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

  let y = MT;
  drawFlourish(doc, centerX, y + 8, NAVY);
  y += 28;

  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(FAINT)
    .text("YOU  ARE  MOST  KINDLY  INVITED  TO", ML, y, {
      width: contentW,
      align: "center",
      characterSpacing: 2.2,
    });
  y += 24;

  doc
    .font("Times-Roman")
    .fontSize(72)
    .fillColor(NAVY)
    .text("Sapphire’s", ML, y, { width: contentW, align: "center" });
  y += 80;

  // Divider + gem + divider
  const dividerW = 110;
  const gemW = 28;
  const gap = 14;
  const groupW = dividerW * 2 + gemW + gap * 2;
  const groupX = (PAGE_W - groupW) / 2;
  const midY = y + 12;
  doc.save();
  doc.strokeColor(NAVY).strokeOpacity(0.55).lineWidth(1);
  doc.moveTo(groupX, midY).lineTo(groupX + dividerW, midY).stroke();
  doc
    .moveTo(groupX + dividerW + gap + gemW + gap, midY)
    .lineTo(groupX + dividerW * 2 + gap * 2 + gemW, midY)
    .stroke();
  doc.restore();
  drawGem(doc, groupX + dividerW + gap + gemW / 2, midY, gemW, NAVY);
  y += 30;

  // "Magical 9th Birthday" — synthesize the "th" as a smaller, raised glyph
  // because the standard fonts don't have Unicode superscripts.
  drawHeadlineWithSuperscript(doc, y, ML, contentW, {
    pre: "Magical 9",
    sup: "th",
    post: " Birthday",
    font: "Times-Italic",
    baseSize: 38,
    supSize: 20,
    color: INK,
  });
  y += 46;

  doc
    .font("Times-Italic")
    .fontSize(15)
    .fillColor(MUTED)
    .text("A fairy-princess celebration in the forest", ML, y, {
      width: contentW,
      align: "center",
    });
  y += 36;

  // Date box
  const dateBoxX = ML + 60;
  const dateBoxW = contentW - 120;
  const dateBoxY = y;
  const dateBoxH = 110;
  doc.save();
  doc
    .roundedRect(dateBoxX, dateBoxY, dateBoxW, dateBoxH, 3)
    .strokeColor(NAVY)
    .lineWidth(0.8)
    .stroke();
  doc.restore();

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(NAVY)
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
    .fillColor(NAVY)
    .text("June 20, 2026", dateBoxX, dateBoxY + 50, {
      width: dateBoxW,
      align: "center",
    });

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#374151")
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
    .fillColor(NAVY)
    .text("WHERE", leftX, sectionY, { characterSpacing: 2.4 });

  doc
    .font("Times-Bold")
    .fontSize(22)
    .fillColor(NAVY)
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
    .fillColor(NAVY)
    .text("WHAT  TO  EXPECT", rightX, sectionY, { characterSpacing: 2.4 });

  const bullets = [
    "Pizza, cake & lemonade",
    "Swimming – bring suits & towels",
    "Forest treasure hunt",
    "Games & whimsy",
    "Sunscreen & comfy shoes",
  ];
  let bulletY = sectionY + 20;
  bullets.forEach((b) => {
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor(NAVY)
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
  const qrSize = 110;
  const qrX = ML + contentW - qrSize - 10;
  const qrY = rsvpY;

  const qrBuffer = await QRCode.toBuffer(RSVP_URL, {
    type: "png",
    margin: 0,
    color: { dark: "#1B2A5C", light: "#FFFFFF" },
    width: 320,
  });

  doc
    .roundedRect(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 3)
    .strokeColor(NAVY)
    .lineWidth(0.8)
    .stroke();

  doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor(NAVY)
    .text("KINDLY  RSVP", leftX, rsvpY + 4, { characterSpacing: 2.4 });

  doc
    .font("Times-Bold")
    .fontSize(24)
    .fillColor(NAVY)
    .text("brooker.family/sapphire", leftX, rsvpY + 22);

  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor(MUTED)
    .text("Scan the code, or text Matt or Brittany.", leftX, rsvpY + 60, {
      width: contentW - qrSize - 30,
    });

  // Footer
  const footerY = PAGE_H - MT - 60;
  drawFlourish(doc, centerX, footerY, NAVY, true);
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

function drawGem(doc, cx, cy, size, color) {
  const r = size / 2;
  doc.save();
  doc.strokeColor(color).lineWidth(1.1);
  const pts = [
    [cx, cy - r],
    [cx + r * 0.85, cy - r * 0.45],
    [cx + r * 0.85, cy + r * 0.45],
    [cx, cy + r],
    [cx - r * 0.85, cy + r * 0.45],
    [cx - r * 0.85, cy - r * 0.45],
  ];
  doc.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) doc.lineTo(pts[i][0], pts[i][1]);
  doc.closePath().stroke();
  doc.strokeOpacity(0.6);
  doc
    .moveTo(pts[5][0], pts[5][1])
    .lineTo(cx, cy - r * 0.15)
    .lineTo(pts[1][0], pts[1][1])
    .stroke();
  doc.moveTo(pts[4][0], pts[4][1]).lineTo(pts[2][0], pts[2][1]).stroke();
  doc.restore();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
