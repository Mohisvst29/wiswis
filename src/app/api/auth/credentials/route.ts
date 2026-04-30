import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    // Verify admin is logged in
    const token = request.cookies.get("admin-token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { currentPassword, newEmail, newPassword } = await request.json();

    // Verify current password
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (currentPassword !== adminPassword) {
      return NextResponse.json({ error: "كلمة المرور الحالية غير صحيحة" }, { status: 400 });
    }

    // Update .env.local file
    const fs = await import('fs');
    const path = await import('path');
    const envPath = path.join(process.cwd(), '.env.local');
    
    let envContent = '';
    try {
      envContent = fs.readFileSync(envPath, 'utf-8');
    } catch {
      envContent = '';
    }

    const lines = envContent.split('\n');
    const newLines: string[] = [];
    let emailSet = false;
    let passwordSet = false;

    for (const line of lines) {
      if (line.startsWith('ADMIN_EMAIL=') && newEmail) {
        newLines.push(`ADMIN_EMAIL=${newEmail}`);
        emailSet = true;
      } else if (line.startsWith('ADMIN_PASSWORD=') && newPassword) {
        newLines.push(`ADMIN_PASSWORD=${newPassword}`);
        passwordSet = true;
      } else {
        newLines.push(line);
      }
    }

    // Add if not found
    if (!emailSet && newEmail) newLines.push(`ADMIN_EMAIL=${newEmail}`);
    if (!passwordSet && newPassword) newLines.push(`ADMIN_PASSWORD=${newPassword}`);

    fs.writeFileSync(envPath, newLines.join('\n'));

    // Update process.env for immediate effect
    if (newEmail) process.env.ADMIN_EMAIL = newEmail;
    if (newPassword) process.env.ADMIN_PASSWORD = newPassword;

    return NextResponse.json({ success: true, message: "تم تحديث بيانات الدخول بنجاح. يرجى تسجيل الدخول مرة أخرى." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
