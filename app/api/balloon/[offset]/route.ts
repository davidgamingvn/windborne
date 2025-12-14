import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://a.windbornesystems.com/treasure/";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ offset: string }> }
) {
  try {
    const resolvedParams = await params;
    const offset = resolvedParams.offset;
    const filename = offset.toString().padStart(2, "0") + ".json";
    const url = API_BASE_URL + filename;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Windborne-App/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
