import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
      const { userId } = await auth();
      if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
      const prefs = await prisma.userPreferences.findUnique({
        where: { clerkUserID: userId },
      });
    
      return NextResponse.json(
        prefs ?? { clerkUserID: userId, lastSearchedLocation: "", lastDayOfWeek: null, lastEventOfDay: null, placeId: null },
        { status: 200 }
      );
    } catch (err) {
      console.error("[GET /api/user/last-location]", err);
      const message = err instanceof Error ? err.message : "Internal server error";
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
}

export async function POST(req: Request) {
    try {
      const { userId } = await auth();
      if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
      const body = await req.json().catch(() => null);
      const lastSearchedLocation = body?.lastSearchedLocation;
      const placeId = body?.placeId ?? null;
      const lastDayOfWeek = body?.lastDayOfWeek;
      const lastEventOfDay = body?.lastEventOfDay;

      const hasLocation = typeof lastSearchedLocation === "string" && lastSearchedLocation.length > 0;
      const hasDay = typeof lastDayOfWeek === "string";
      const hasEvent = typeof lastEventOfDay === "string";

      if (!hasLocation && !hasDay && !hasEvent) {
        return NextResponse.json(
          { error: "At least one of lastSearchedLocation, lastDayOfWeek, or lastEventOfDay is required" },
          { status: 400 }
        );
      }

      const prefs = await prisma.userPreferences.upsert({
        where: { clerkUserID: userId },
        create: {
          clerkUserID: userId,
          lastSearchedLocation: hasLocation ? lastSearchedLocation : "",
          placeId,
          lastDayOfWeek: hasDay ? lastDayOfWeek : null,
          lastEventOfDay: hasEvent ? lastEventOfDay : null,
        },
        update: {
          ...(hasLocation && { lastSearchedLocation, placeId }),
          ...(hasDay && { lastDayOfWeek }),
          ...(hasEvent && { lastEventOfDay }),
        },
      });
    
      return NextResponse.json(prefs, { status: 200 });
    } catch (err) {
      console.error("[POST /api/user/last-location]", err);
      const message = err instanceof Error ? err.message : "Internal server error";
      return NextResponse.json(
        { error: message },
        { status: 500 }
      );
    }
}
  