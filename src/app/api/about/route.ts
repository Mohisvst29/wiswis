import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import About from "@/models/About";

export async function GET() {
  try {
    await connectDB();
    let about = await About.findOne();
    if (!about) {
      about = await About.create({
        title: { ar: "من نحن", en: "About Us" },
        description: {
          ar: "ويسويس شركة رائدة في مجال خدمات الوقود والخدمات المساندة على الطرق. نسعى لتقديم تجربة متكاملة تجمع بين جودة الخدمة وراحة العملاء، من خلال محطات وقود حديثة ومجهزة بأعلى المعايير.",
          en: "Wiswis is a leading company in fuel services and roadside assistance. We strive to deliver a comprehensive experience that combines service quality with customer comfort, through modern fuel stations equipped to the highest standards."
        },
        image: "",
        yearsOfExperience: 15,
      });
    }
    return NextResponse.json(about);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    let about = await About.findOne();
    if (about) {
      Object.assign(about, body);
      await about.save();
    } else {
      about = await About.create(body);
    }
    return NextResponse.json(about);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
