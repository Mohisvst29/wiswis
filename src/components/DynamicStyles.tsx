import React from "react";
import dbConnect from "@/lib/mongoose";
import { Settings } from "@/models";

export const dynamic = 'force-dynamic';

export default async function DynamicStyles() {
  let settings: any = {};
  try {
    await dbConnect();
    const settingsData = await Settings.find({});
    settings = settingsData.reduce((acc: any, item: any) => ({ ...acc, [item.key]: item.value }), {});
  } catch (e) {
    console.error("Failed to load settings:", e);
  }

  const primaryColor = settings.primaryColor || "#D4A017";
  const headingColor = settings.headingColor || "#1a1a1a";
  const textColor = settings.textColor || "#374151";
  const fontFamily = settings.fontFamily || "Cairo";
  const logoWidth = settings.logoWidth || "";
  const logoHeight = settings.logoHeight || "";

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      :root {
        --color-primary: ${primaryColor};
      }
      body {
        font-family: '${fontFamily}', sans-serif !important;
        color: ${textColor};
      }
      h1, h2, h3, h4, h5, h6 {
        color: ${headingColor};
        font-family: '${fontFamily}', sans-serif !important;
      }
      .gradient-text {
        background: linear-gradient(135deg, var(--color-primary), #1a1a1a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      ${logoWidth ? `.brand-logo, .brand-logo-footer { width: ${logoWidth} !important; max-width: 100% !important; }` : ''}
      ${logoHeight ? `.brand-logo, .brand-logo-footer { height: ${logoHeight} !important; }` : ''}
    `}} />
  );
}
