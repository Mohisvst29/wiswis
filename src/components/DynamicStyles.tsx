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

  const primaryColor = settings.primaryColor || "#bd121c";
  const headingColor = settings.headingColor || "#ffffff";
  const textColor = settings.textColor || "#d1d5db";
  const fontFamily = settings.fontFamily || "Cairo";

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      :root {
        --color-primary: ${primaryColor};
      }
      body {
        font-family: '${fontFamily}', sans-serif !important;
        color: ${textColor} !important;
      }
      h1, h2, h3, h4, h5, h6, .gradient-text {
        color: ${headingColor} !important;
        font-family: '${fontFamily}', sans-serif !important;
      }
      .gradient-text {
        background: linear-gradient(135deg, var(--color-primary), #fff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    `}} />
  );
}
