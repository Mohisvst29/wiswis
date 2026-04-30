import React from "react";
import dbConnect from "@/lib/mongoose";
import { Settings } from "@/models";

export default async function DynamicStyles() {
  await dbConnect();
  const settingsData = await Settings.find({});
  const settings = settingsData.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});

  const primaryColor = settings.primaryColor || "var(--color-primary)";
  const headingColor = settings.headingColor || "#ffffff";
  const textColor = settings.textColor || "var(--color-text-muted)";
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
