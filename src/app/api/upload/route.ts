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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type;
    const dataUri = `data:${mimeType};base64,${base64}`;

    const resourceType = mimeType.startsWith("video/") ? "video" : "image";

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "wiswis",
      resource_type: resourceType,
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
