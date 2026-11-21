export interface ColorPreset {
  name: string;
  hex: string;
  label: string;
}

export const THEME_COLOR_PRESETS: ColorPreset[] = [
  { name: "blue", hex: "#2563eb", label: "SKILLHUB Royal Blue" },
  { name: "indigo", hex: "#4f46e5", label: "Electric Indigo" },
  { name: "violet", hex: "#7c3aed", label: "Deep Violet" },
  { name: "emerald", hex: "#10b981", label: "Emerald Green" },
  { name: "teal", hex: "#0d9488", label: "Ocean Teal" },
  { name: "cyan", hex: "#06b6d4", label: "Cyber Cyan" },
  { name: "rose", hex: "#f43f5e", label: "Vibrant Rose" },
  { name: "orange", hex: "#ea580c", label: "Flame Orange" },
  { name: "amber", hex: "#d97706", label: "Amber Gold" },
  { name: "slate", hex: "#475569", label: "Modern Slate" },
];

/**
 * Normalizes hex string to standard 6-char hex with '#' prefix
 */
export function normalizeHex(hex: string): string {
  let clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) {
    return "#2563eb"; // fallback default
  }
  return `#${clean.toLowerCase()}`;
}

/**
 * Converts a hex color string to space-separated HSL values (e.g., "221.2 83.2% 53.3%")
 * matching Tailwind CSS variable format.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number; hslString: string } {
  const cleanHex = normalizeHex(hex).substring(1);
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / delta + 2) / 6;
        break;
      case b:
        h = ((r - g) / delta + 4) / 6;
        break;
    }
  }

  const hue = Math.round(h * 360 * 10) / 10;
  const sat = Math.round(s * 100 * 10) / 10;
  const lum = Math.round(l * 100 * 10) / 10;

  return {
    h: hue,
    s: sat,
    l: lum,
    hslString: `${hue} ${sat}% ${lum}%`,
  };
}

/**
 * Generates dark mode variant for primary (slightly higher lightness for dark mode contrast)
 */
export function hexToDarkHsl(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  // Increase lightness slightly if it is too dark for dark backgrounds
  const adjustedL = Math.min(Math.max(l, 55), 70);
  return `${h} ${s}% ${adjustedL}%`;
}

/**
 * Computes optimal text foreground color (white or dark slate) based on background luminance
 */
export function getContrastForeground(hex: string): string {
  const cleanHex = normalizeHex(hex).substring(1);
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // If bright background, return dark text; else white
  return brightness > 155 ? "222.2 84% 4.9%" : "210 40% 98%";
}
