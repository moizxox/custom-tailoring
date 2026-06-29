import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { getAdminT } from "@/lib/i18n/admin";

export async function POST(request: NextRequest) {
  const t = getAdminT("api");

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: t("unauthorized") }, { status: 401 });
    }

    const { name, email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: t("fieldsRequired") }, { status: 400 });
    }
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
      return NextResponse.json({ error: t("usernameInvalid") }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: t("passwordTooShort") }, { status: 400 });
    }

    const existingEmail = await prisma.admin.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: t("emailTaken") }, { status: 409 });
    }

    const existingUsername = await prisma.admin.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json({ error: t("usernameTaken") }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.admin.create({
      data: { email, username, password: hashed, name: name || null },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: t("serverError") }, { status: 500 });
  }
}
