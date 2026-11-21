#!/usr/bin/env node

/**
 * SKILLHUB Dynamic Portfolio System - Local Environment Setup Script
 * Author: Akash Dhone (SKILLHUB IT SOLUTION)
 * Website: https://www.skillhubdev.com
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");
const crypto = require("crypto");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question, defaultValue = "") {
  return new Promise((resolve) => {
    const promptText = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
    rl.question(promptText, (answer) => {
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function run() {
  console.log("\n==================================================================");
  console.log("   🚀 SKILLHUB Dynamic Portfolio - Environment Configuration Helper");
  console.log("   Author: Akash Dhone | SKILLHUB IT SOLUTION");
  console.log("   Website: https://www.skillhubdev.com");
  console.log("==================================================================\n");

  const envPath = path.join(process.cwd(), ".env.local");
  let existingEnv = {};

  if (fs.existsSync(envPath)) {
    console.log("ℹ️  Existing .env.local file detected. Press ENTER to keep current values.\n");
    const content = fs.readFileSync(envPath, "utf-8");
    content.split("\n").forEach((line) => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = (match[2] || "").trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        existingEnv[match[1]] = val;
      }
    });
  }

  const appName = await ask("Application Name", existingEnv.SKILLHUB_APP_NAME || "SKILLHUB Portfolio");
  const authorName = await ask("Candidate / Author Name", existingEnv.SKILLHUB_APP_AUTHOR || "Candidate Name");
  const appUrl = await ask("Local App URL", existingEnv.SKILLHUB_APP_URL || "http://localhost:3000");

  console.log("\n--- MongoDB Configuration ---");
  console.log("💡 You can use MongoDB Atlas (mongodb+srv://...) or local MongoDB (mongodb://localhost:27017/portfolio)");
  const mongoUri = await ask("MongoDB URI", existingEnv.SKILLHUB_MONGODB_URI || "");

  console.log("\n--- Authentication Secret ---");
  let authSecret = existingEnv.SKILLHUB_AUTH_SECRET;
  if (!authSecret) {
    authSecret = crypto.randomBytes(32).toString("hex");
    console.log("✨ Automatically generated secure 256-bit authentication secret!");
  } else {
    authSecret = await ask("Auth Secret (32+ chars)", authSecret);
  }

  console.log("\n--- Cloudinary Storage (MANDATORY for Image & Resume Uploads) ---");
  console.log("💡 Get free credentials at: https://cloudinary.com");
  const cloudName = await ask("Cloudinary Cloud Name *", existingEnv.SKILLHUB_CLOUDINARY_CLOUD_NAME || "");
  const apiKey = await ask("Cloudinary API Key *", existingEnv.SKILLHUB_CLOUDINARY_API_KEY || "");
  const apiSecret = await ask("Cloudinary API Secret *", existingEnv.SKILLHUB_CLOUDINARY_API_SECRET || "");

  console.log("\n--- Gmail SMTP Email (Optional, press ENTER to skip) ---");
  const gmailUser = await ask("Gmail Address", existingEnv.SKILLHUB_GMAIL_USER || "");
  const gmailPass = await ask("Gmail 16-Character App Password", existingEnv.SKILLHUB_GMAIL_APP_PASSWORD || "");

  const envContent = `# ==============================================================================
# SKILLHUB Dynamic Portfolio Management System - Local Configuration
# Organization: SKILLHUB IT SOLUTION
# Author: Akash Dhone (https://www.skillhubdev.com)
# Generated on: ${new Date().toISOString()}
# ==============================================================================

SKILLHUB_APP_NAME="${appName}"
SKILLHUB_APP_AUTHOR="${authorName}"
SKILLHUB_APP_URL="${appUrl}"
SKILLHUB_APP_VERSION="1.0.0"

# DATABASE
SKILLHUB_MONGODB_URI="${mongoUri}"

# AUTHENTICATION
SKILLHUB_AUTH_SECRET="${authSecret}"

# CLOUDINARY
SKILLHUB_CLOUDINARY_CLOUD_NAME="${cloudName}"
SKILLHUB_CLOUDINARY_API_KEY="${apiKey}"
SKILLHUB_CLOUDINARY_API_SECRET="${apiSecret}"

# EMAIL - GMAIL SMTP
SKILLHUB_GMAIL_USER="${gmailUser}"
SKILLHUB_GMAIL_APP_PASSWORD="${gmailPass}"

# SETTINGS
SKILLHUB_DEFAULT_THEME="system"
`;

  fs.writeFileSync(envPath, envContent, "utf-8");

  console.log("\n✅ .env.local created / updated successfully!");
  console.log("🚀 You can now start the application with:");
  console.log("   npm run dev\n");
  console.log("Then visit http://localhost:3000 to complete the interactive setup wizard!\n");

  rl.close();
}

run().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
