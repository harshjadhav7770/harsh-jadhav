"use client";

import * as React from "react";
import { useState } from "react";
import { Check, Pipette, RefreshCw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  THEME_COLOR_PRESETS,
  normalizeHex,
  hexToHsl,
} from "@/lib/theme/colors";

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  description?: string;
}

export function ColorPicker({
  value = "#2563eb",
  onChange,
  label = "Accent / Primary Color",
  description = "Select a preset theme color or customize any exact HEX code",
}: ColorPickerProps) {
  const normalizedValue = normalizeHex(value);
  const [internalHex, setInternalHex] = useState(normalizedValue);
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    setInternalHex(normalizeHex(value));
  }, [value]);

  const handleSelectColor = (hex: string) => {
    const formatted = normalizeHex(hex);
    setInternalHex(formatted);
    onChange?.(formatted);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInternalHex(raw);
    if (/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(raw)) {
      onChange?.(normalizeHex(raw));
    }
  };

  const activePreset = THEME_COLOR_PRESETS.find(
    (p) => p.hex.toLowerCase() === normalizedValue.toLowerCase()
  );

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm font-medium">{label}</Label>}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}

      <div className="flex items-center gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-input bg-background hover:bg-muted/60 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {/* Color Swatch Dot */}
              <div
                className="w-5 h-5 rounded-full border border-black/10 shadow-sm flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: normalizedValue }}
              />
              <span className="font-mono text-xs uppercase font-medium">{normalizedValue}</span>
              {activePreset && (
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ({activePreset.name})
                </span>
              )}
            </button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-4 space-y-4" align="start">
            <div>
              <h4 className="font-semibold text-sm">Theme Accent Color</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Updates buttons, badges, links, and highlights across the entire site.
              </p>
            </div>

            {/* Presets Grid */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">Presets</Label>
              <div className="grid grid-cols-5 gap-2">
                {THEME_COLOR_PRESETS.map((preset) => {
                  const isSelected =
                    normalizedValue.toLowerCase() === preset.hex.toLowerCase();
                  return (
                    <button
                      key={preset.name}
                      type="button"
                      title={preset.label}
                      onClick={() => handleSelectColor(preset.hex)}
                      className="group relative h-9 w-full rounded-md border flex items-center justify-center transition-all hover:scale-105 hover:shadow-sm"
                      style={{ backgroundColor: preset.hex }}
                    >
                      {isSelected && (
                        <Check className="h-4 w-4 text-white drop-shadow-md stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Eyedropper & Input */}
            <div className="space-y-2 pt-2 border-t">
              <Label className="text-xs text-muted-foreground font-medium">
                Custom Palette Code
              </Label>
              <div className="flex items-center gap-2">
                {/* Native Color Picker Trigger */}
                <div className="relative">
                  <input
                    type="color"
                    id="native-color-picker"
                    value={normalizedValue}
                    onChange={(e) => handleSelectColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div
                    className="w-9 h-9 rounded-md border border-input shadow-sm flex items-center justify-center cursor-pointer hover:border-ring transition-colors"
                    style={{ backgroundColor: normalizedValue }}
                    title="Pick from screen"
                  >
                    <Pipette className="h-4 w-4 text-white drop-shadow-md" />
                  </div>
                </div>

                {/* Direct Hex Input */}
                <Input
                  value={internalHex}
                  onChange={handleHexInputChange}
                  placeholder="#2563eb"
                  className="font-mono text-xs uppercase"
                  maxLength={7}
                />

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  title="Reset to default SKILLHUB Blue"
                  onClick={() => handleSelectColor("#2563eb")}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Live Preview Mini Card */}
            <div className="rounded-lg border p-2.5 bg-muted/40 space-y-2">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                Live Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 text-xs rounded font-medium shadow-sm"
                  style={{
                    backgroundColor: normalizedValue,
                    color: "#ffffff",
                  }}
                >
                  Primary CTA
                </button>
                <span
                  className="text-xs font-semibold"
                  style={{ color: normalizedValue }}
                >
                  Accent Link
                </span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Instant Preview Badge */}
        <div className="flex items-center gap-2">
          <div
            className="h-3 w-3 rounded-full animate-pulse"
            style={{ backgroundColor: normalizedValue }}
          />
          <span className="text-xs text-muted-foreground font-mono">
            {hexToHsl(normalizedValue).hslString}
          </span>
        </div>
      </div>
    </div>
  );
}
