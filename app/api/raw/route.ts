import { resume } from "@/lib/resume";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(resume);
}
