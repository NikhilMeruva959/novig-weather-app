import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input");

  if (!input || input.trim().length < 1) {
    return NextResponse.json(
      { error: "Input must be at least 1 characters" },
      { status: 400 },
    );
  }

  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/autocomplete/json",
  );

  url.searchParams.set("input", input);
  url.searchParams.set("key", process.env.GOOGLE_PLACES_API_KEY!);
  url.searchParams.set("types", "geocode"); // Restrict to addresses

  const res = await fetch(url.toString());
  const data = await res.json();

  return NextResponse.json(data);
}
