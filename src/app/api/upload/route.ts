export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/mongoose";
import { Media } from "@/models";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum 10MB allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type;
    const dataUri = `data:${mimeType};base64,${base64}`;

    const resourceType = mimeType.startsWith("video/") ? "video" : "image";

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "wiswis",
      resource_type: resourceType,
      timeout: 60000,
    });

    await connectDB();
    const media = await Media.create({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      resourceType,
      media
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}

