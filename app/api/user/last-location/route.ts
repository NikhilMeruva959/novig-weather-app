import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const prefs = await prisma.userPreferences.findUnique({
      where: { clerkUserID: userId },
    });
  
    return NextResponse.json(
      prefs ?? { clerkUserID: userId, lastSearchedLocation: "", placeId: null },
      { status: 200 }
    );
}

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const body = await req.json().catch(() => null);
    const lastSearchedLocation = body?.lastSearchedLocation;
    const placeId = body?.placeId ?? null;
  
    if (typeof lastSearchedLocation !== "string" || lastSearchedLocation.length === 0) {
      return NextResponse.json(
        { error: "lastSearchedLocation is required" },
        { status: 400 }
      );
    }
  
    const prefs = await prisma.userPreferences.upsert({
      where: { clerkUserID: userId },
      create: {
        clerkUserID: userId,
        lastSearchedLocation,
        placeId,
      },
      update: {
        lastSearchedLocation,
        placeId,
      },
    });
  
    return NextResponse.json(prefs, { status: 200 });
}
  