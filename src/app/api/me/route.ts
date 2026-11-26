import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ userId: null }, { status: 401 });
    return NextResponse.json({ userId: user.id });
  } catch {
    return NextResponse.json({ userId: null }, { status: 500 });
  }
}
