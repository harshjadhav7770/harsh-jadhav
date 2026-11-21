"use client";

import * as React from "react";
import { useEffect } from "react";
import { hexToHsl, hexToDarkHsl, getContrastForeground, normalizeHex } from "@/lib/theme/colors";

interface DynamicThemeInjectorProps {
  color?: string;
}

/**
 * Injects dynamic CSS variables for --primary, --primary-foreground, and --ring
 * into document.documentElement and renders a server/client style block to prevent FOUC.
 */
export function DynamicThemeInjector({ color = "#2563eb" }: DynamicThemeInjectorProps) {
  const normalized = normalizeHex(color);
  const lightPrimary = hexToHsl(normalized).hslString;
  const darkPrimary = hexToDarkHsl(normalized);
  const lightForeground = getContrastForeground(normalized);
  const darkForeground = "210 40% 98%";

  // Apply to DOM directly for immediate hot-updates during admin preview
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.style.setProperty("--primary", lightPrimary);
      root.style.setProperty("--ring", lightPrimary);
      root.style.setProperty("--primary-foreground", lightForeground);
    }
  }, [lightPrimary, lightForeground]);

  const cssStyle = `
    :root {
      --primary: ${lightPrimary} !important;
      --ring: ${lightPrimary} !important;
      --primary-foreground: ${lightForeground} !important;
    }
    .dark {
      --primary: ${darkPrimary} !important;
      --ring: ${darkPrimary} !important;
      --primary-foreground: ${darkForeground} !important;
    }
  `;

  return (
    <style
      id="skillhub-dynamic-accent"
      dangerouslySetInnerHTML={{ __html: cssStyle }}
    />
  );
}
