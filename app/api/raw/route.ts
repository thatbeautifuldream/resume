import { resume } from "@/lib/resume";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.json(resume);
}
