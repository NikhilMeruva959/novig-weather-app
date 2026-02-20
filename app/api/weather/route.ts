import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  const date = searchParams.get("date");

  if (!location || location.trim().length < 1) {
    return NextResponse.json(
      { error: "Location is required" },
      { status: 400 },
    );
  }
  if (!date || date.trim().length < 1) {
    return NextResponse.json(
      { error: "Date is required" },
      { status: 400 },
    );
  }

  const basePath = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";
  const url = new URL(`${basePath}/${encodeURIComponent(location)}/${date}`);

  url.searchParams.set("key", process.env.VISUAL_CROSSING_API_KEY!);
  url.searchParams.set("unitGroup", "us");
  url.searchParams.set("contentType", "json");
  url.searchParams.set("include", "days,hours");
  url.searchParams.set("lang", "en");

  const res = await fetch(url.toString());
  const data = await res.json();

  return NextResponse.json(data);
}
